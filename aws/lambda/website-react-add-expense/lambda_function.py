from pymongo import MongoClient
import boto3
import json
from datetime import datetime
import pprint


SECRET_ID = 'mongodb-website'
REGION_NAME = 'us-west-1'
DATABASE = 'db-react'
COLLECTION = 'expense'


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
collection = client[DATABASE][COLLECTION]


def lambda_handler(event, context):
    
    # Get user input
    body = json.loads(event['body'])
    date = body['date']
    item = body['item']
    type = body['type']
    amount = float(body['amount'])
    place = body['place']
    memo = ''
    if 'memo' in body:
        memo = body['memo']
        
    # Make data to MongoDB
    document = {
        'date': date,
        'item': item,
        'type': type,
        'amount': amount,
        'place': place,
        'memo': memo,
        'creation_time': datetime.utcnow()
    }
    
    # Upload it to MondoDB
    result = collection.insert_one(document)
    print(f'Added a new expense item with ObjectId: {result.inserted_id}')
    
    # Make response
    response = {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'message': 'Added the new expense successfully'
        })
    }
    
    return response
    
if __name__ == '__main__':
    event = {
        'date': '2021-10-23',
        'item': 'Lunch',
        'type': 'Expense',
        'amount': 0,
        'place': 'Home',
    }
    pprint.pprint(lambda_handler(event, ''))
    