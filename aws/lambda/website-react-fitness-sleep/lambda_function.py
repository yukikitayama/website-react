from pymongo import MongoClient
import boto3
import json
import pprint


SECRET_ID = 'mongodb-website'
REGION_NAME = 'us-west-1'
DATABASE = 'fitbit'
COLLECTION = 'sleep-log'


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
    
    # Get sleep log from MongoDB
    sleeps = []
    for doc in collection.find().sort('date', 1):
        sleep = {
            'date': doc['date'],
            'totalMinutesAsleep': doc['summary']['totalMinutesAsleep']
        }
        sleeps.append(sleep)
        
    # Make response
    response = {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'data': sleeps
        })
    }
    
    return response


if __name__ == '__main__':
    pprint.pprint(lambda_handler('', ''))
