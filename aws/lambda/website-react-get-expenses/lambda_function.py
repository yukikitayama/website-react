from pymongo import MongoClient
from bson import json_util
from bson.objectid import ObjectId
import boto3
from datetime import datetime
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
        
    # Get daily total expense
    elif (
        event['queryStringParameters'] is not None
        and 'type' in event['queryStringParameters']
        and event['queryStringParameters']['type'] == 'daily'
        and 'startDate' in event['queryStringParameters']
        and 'endDate' in event['queryStringParameters']
    ):
        start_date = event['queryStringParameters']['startDate']
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = event['queryStringParameters']['endDate']
        end_date = datetime.strptime(end_date, '%Y-%m-%d')

        pipeline = [
            # Convert date string to datetime
            { '$addFields': { 'convertedDate': { '$toDate': '$date' } } },
            # Filter documents by start date and end date
            { '$match': { 'convertedDate': { '$gte': start_date, '$lte': end_date } } },
            # Calculate daily total
            { '$group': {
                '_id': {
                    'date': { '$dateToString': { 'format': '%Y-%m-%d', 'date': '$convertedDate' } }
                },
                'totalExpense': { '$sum': '$amount' }
            } },
            # Sort by calendar
            { '$sort': { '_id.date': 1 } }
        ]
        
        expenses = []
        for expense in collection.aggregate(pipeline):
            date = expense['_id']['date']
            expense['date'] = date
            del expense['_id']
            expense['totalExpense'] = round(expense['totalExpense'], 2)
            expenses.append(expense)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'expenses': expenses
            })
        }
        
    # Get monthly total expense
    elif (
        event['queryStringParameters'] is not None
        and 'startDate' in event['queryStringParameters']
        and 'endDate' in event['queryStringParameters']
    ):
        start_date = event['queryStringParameters']['startDate']
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = event['queryStringParameters']['endDate']
        end_date = datetime.strptime(end_date, '%Y-%m-%d')
        
        pipeline = [
            # Convert date string to datetime
            { '$addFields': { 'convertedDate': { '$toDate': '$date' } } },
            # Filter documents by start date and end date
            { '$match': { 'convertedDate': {'$gte': start_date, '$lte': end_date} } },
            # Calculate monthly total
            { '$group': {
                '_id': { 
                    'year': { '$year': '$convertedDate' },
                    'month': { '$month': '$convertedDate' }
                },
                'totalExpense': { '$sum': '$amount' }
            } },
            # Sort by calendar
            { '$sort': { '_id.year': 1, '_id.month': 1 } }
        ]
        expenses = []
        for expense in collection.aggregate(pipeline):
            year = expense['_id']['year']
            month = expense['_id']['month']
            expense['yearMonth'] = f'{year}-0{month}' if month < 10 else f'{year}-{month}'
            del expense['_id']
            expense['totalExpense'] = round(expense['totalExpense'], 2)
            expenses.append(expense)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'expenses': expenses
            })
        }

    # Get all the expense data by descending date order
    expenses = []
    for expense in collection.find().sort('date', -1):
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
    # event = {
    #     'queryStringParameters': {
    #         'id': '617616e4ee56f35a0a4cfd03'
    #     }
    # }
    # event = {
    #     'queryStringParameters': {
    #         'startDate': '2021-10-01',
    #         'endDate': '2022-02-01'
    #     }
    # }
    # event = {
    #     'queryStringParameters': {
    #         'test': 1
    #     }
    # }
    event = {
        'queryStringParameters': {
            'type': 'daily',
            'startDate': '2022-02-01',
            'endDate': '2022-02-02'
        }
    }
    pprint.pprint(lambda_handler(event, ''))
