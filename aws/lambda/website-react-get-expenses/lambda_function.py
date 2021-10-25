from pymongo import MongoClient
from bson import json_util
from bson.objectid import ObjectId
import boto3
import json
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
db = client[DATABASE]
collection = db[COLLECTION]


def lambda_handler(event, context):
    
    # print('event:')
    # pprint.pprint(event)
    
    # Get a single expense data by ID when ID parameter is specified
    if (
        event['queryStringParameters'] is not None and
        'id' in event['queryStringParameters']
    ):
        expense_id = event['queryStringParameters']['id']
        
        # Find a single data
        expense = collection.find_one({'_id': ObjectId(expense_id)})
        expense = json.loads(json_util.dumps(expense))
        expense['_id'] = expense['_id']['$oid']

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'expense': expense
            })
        }

    # Get all the expense data
    expenses = []
    for expense in collection.find():
        # Use json_util for BSON ID
        expense = json.loads(json_util.dumps(expense))
        # Extract ID string
        expense['_id'] = expense['_id']['$oid']
        # Web application side does not need creation time
        del expense['creation_time']
        expenses.append(expense)

    # Make response
    response = {
        'statusCode': 200,
        # Add the header to enable CORS for the Lambda proxy integration
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        # API Gateway requires only body is JSON
        'body': json.dumps({
            'message': 'Expenses fetched successfully',
            'expenses': expenses
        })
    }

    return response
    
    
if __name__ == '__main__':
    event = {
        'queryStringParameters': {
            'id': '617616e4ee56f35a0a4cfd03'
        }
    }
    pprint.pprint(lambda_handler(event, ''))
