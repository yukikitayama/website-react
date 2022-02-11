from pymongo import MongoClient
from dateutil import parser
import boto3
from datetime import datetime, timedelta
import collections
import json
import pprint


SECRET_ID = 'mongodb-website'
REGION_NAME = 'us-west-1'
DATABASE = 'stack-exchange'
COLLECTION = 'stack-overflow'
START = datetime.utcnow() - timedelta(days=2)
END = START + timedelta(days=1)
TOP = 30


def get_secret(secret_id: str, region_name: str) -> dict:
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    content = client.get_secret_value(SecretId=secret_id)
    secret_string = content['SecretString']
    secret = json.loads(secret_string)
    return secret


# Get secrets
secret = get_secret(secret_id=SECRET_ID, region_name=REGION_NAME)
cluster = secret['mongodb-cluster']
username = secret['mongodb-username']
password = secret['mongodb-password']

# MongoDB client
host = f'mongodb+srv://{username}:{password}@{cluster}/{DATABASE}?retryWrites=true&w=majority'
client = MongoClient(host)
db = client[DATABASE]
collection = db[COLLECTION]


def lambda_handler(event, context):
    
    headers = { 'Access-Control-Allow-Origin': '*' }
    
    if (
        'queryStringParameters' in event
        and event['queryStringParameters'] is not None
        and 'top' in event['queryStringParameters']
    ):
        # Top and bottom indices are 1-based index and inclusive
        top = int(event['queryStringParameters']['top'])
        bottom = int(event['queryStringParameters']['bottom'])
        start = parser.parse(event['queryStringParameters']['start'])
        end = parser.parse(event['queryStringParameters']['end'])
        
        # print(f'start: {start}, end: {end}')
        
        filter_ = {
            'from-date': { '$gte': start },
            'to-date': { '$lte': end }
        }
        projection = { 'count-tag': 1 }
        
        counts = collections.defaultdict(int)
        for doc in collection.find(filter_, projection):
            for count_tag in doc['count-tag']:
                counts[count_tag['tag']] += count_tag['count']
                
        response_data = []
        for k, v in sorted(counts.items(), key=lambda x: x[1], reverse=True)[(top - 1):(bottom + 1)]:
            response_data.append({ 'name': k, 'count': v })
            
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({ 'data': response_data })
        }
            
    
    
    query = { 
        'from-date': { '$gte': START }, 
        'to-date': { '$lte': END } 
    }
    
    counts = collections.defaultdict(int)
    for doc in collection.find(query, { 'count-tag': 1 }):
        tags = doc['count-tag']
        for tag in tags:
            counts[tag['tag']] += tag['count']
    
    data = []
    for k, v in sorted(counts.items(), key=lambda x: x[1], reverse=True)[:TOP]:
        data.append({ 'name': k, 'count': v })
        
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({ 'data': data })
    }


if __name__ == '__main__':
    event = {
        'queryStringParameters': {
            'top': 1,
            'bottom': 10,
            'start': '2022-02-07T00:00:00Z',
            'end': '2022-02-10T12:00:00Z'
        }
    }
    pprint.pprint(lambda_handler(event, ''))