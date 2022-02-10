from pymongo import MongoClient
import boto3
from datetime import datetime
import json
import pprint


SECRET_ID = 'mongodb-website'
REGION_NAME = 'us-west-1'
DATABASE = 'fitbit'


def get_secret(secret_id: str, region_name: str) -> dict:
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    content = client.get_secret_value(SecretId=secret_id)
    secret_string = content['SecretString']
    secret = json.loads(secret_string)
    return secret


# Get secrets
secret_mongodb = get_secret(secret_id=SECRET_ID, region_name=REGION_NAME)
cluster = secret_mongodb['mongodb-cluster']
username = secret_mongodb['mongodb-username']
password = secret_mongodb['mongodb-password']

# MongoDB client
host = f'mongodb+srv://{username}:{password}@{cluster}/{DATABASE}?retryWrites=true&w=majority'
client = MongoClient(host)
db = client[DATABASE]


def lambda_handler(event, context):
    
    headers = { 'Access-Control-Allow-Origin': '*' }
    
    if (
        'queryStringParameters' in event
        and event['queryStringParameters'] is not None
        and 'data' in event['queryStringParameters']
    ):
        data = event['queryStringParameters']['data']
        start = event['queryStringParameters']['start']
        end = event['queryStringParameters']['end']
        
        # print(f'data: {data}, start: {start}, end: {end}')
        
        # Daily calory burn
        if data == 'calories':
            collection = db['activity-calories']
            filter_ = { 'date': { '$gte': start, '$lte': end } }
            projection = { 'activities-calories': 1 }
            response_data = []
            for calorie in collection.find(filter_, projection):
                # response_data.append(calorie['activities-calories'][0])
                response_data.append({
                    'date': calorie['activities-calories'][0]['dateTime'],
                    'value': calorie['activities-calories'][0]['value']
                })
                
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({ 'data': response_data })
            }
            
        elif data == 'steps':
            collection = db['activity-steps']
            filter_ = { 'date': { '$gte': start, '$lte': end } }
            projection = { 'activities-steps': 1 }
            response_data = []
            for step in collection.find(filter_, projection):
                # response_data.append(step['activities-steps'][0])
                response_data.append({
                    'date': step['activities-steps'][0]['dateTime'],
                    'value': step['activities-steps'][0]['value']
                })
                
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({ 'data': response_data })
            }

        elif data == 'water':
            collection = db['water-log']
            filter_ = { 'date': { '$gte': start, '$lte': end } }
            projection = { 'date': 1, 'summary': 1 }
            response_data = []
            for water in collection.find(filter_, projection):
                response_data.append({
                    'date': water['date'],
                    'value': water['summary']['water']
                })
                
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({ 'data': response_data })
            }
            
        elif data == 'weight':
            collection = db['weight-log']
            filter_ = { 'date': { '$gte': start, '$lte': end } }
            projection = { 'date': 1, 'weight': 1 }
            response_data = []
            for weight in collection.find(filter_, projection):
                response_data.append({
                    'date': weight['date'],
                    'value': weight['weight'][0]['weight']
                })

            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({ 'data': response_data })
            }
            
        elif data == 'sleep':
            collection = db['sleep-log']
            filter_ = { 'date': { '$gte': start, '$lte': end } }
            projection = { 'date': 1, 'summary': 1 }
            response_data = []
            for sleep in collection.find(filter_, projection):
                response_data.append({
                    'date': sleep['date'],
                    'value': sleep['summary']['totalMinutesAsleep']
                })

            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({ 'data': response_data })
            }
            
        elif data == 'deep-sleep':
            collection = db['sleep-log']
            filter_ = { 'date': { '$gte': start, '$lte': end } }
            projection = { 'date': 1, 'summary': 1 }
            response_data = []
            for sleep in collection.find(filter_, projection):
                total_time_in_bed = sleep['summary']['totalTimeInBed']
                deep = sleep['summary']['stages']['deep']
                deep_percent = round(deep / total_time_in_bed, 2)
                response_data.append({
                    'date': sleep['date'],
                    'value': deep_percent
                })
                
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({ 'data': response_data })
            }


if __name__ == '__main__':
    event = {
        'queryStringParameters': {
            'data': 'deep-sleep',
            'start': '2022-02-05',
            'end': '2022-02-08'
        }
    }
    pprint.pprint(lambda_handler(event, ''))
