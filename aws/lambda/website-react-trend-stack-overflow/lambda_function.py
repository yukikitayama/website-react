from pymongo import MongoClient
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
TOP = 100


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
        data.append({ 'tag': k, 'count': v })
        
    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin': '*' },
        'body': json.dumps({ 'data': data })
    }


if __name__ == '__main__':
    pprint.pprint(lambda_handler('', ''))