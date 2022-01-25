from pymongo import MongoClient
from bson import json_util
from bson.objectid import ObjectId
import boto3
import json
import pprint


SECRET_ID_01 = 'mongodb-website'
REGION_NAME = 'us-west-1'
DATABASE = 'db-react'
COLLECTION = 'skill'


def get_secret(secret_id: str, region_name: str) -> dict:
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    content = client.get_secret_value(SecretId=secret_id)
    secret_string = content['SecretString']
    secret = json.loads(secret_string)
    return secret


# Get secrets
secret_mongodb = get_secret(secret_id=SECRET_ID_01, region_name=REGION_NAME)
cluster = secret_mongodb['mongodb-cluster']
username = secret_mongodb['mongodb-username']
password = secret_mongodb['mongodb-password']

# MongoDB client
host = f'mongodb+srv://{username}:{password}@{cluster}/{DATABASE}?retryWrites=true&w=majority'
client = MongoClient(host)
db = client[DATABASE]
collection = db[COLLECTION]


def lambda_handler(event, context):
    
    # Get a single post by ID when ID parameter is specified
    if (
        'queryStringParameters' in event 
        and event['queryStringParameters'] is not None
        and 'id' in event['queryStringParameters']
    ):
        postId = event['queryStringParameters']['id']
        
        # Find a single data
        post = collection.find_one({'_id': ObjectId(postId)})
        post = json.loads(json_util.dumps(post))
        post['_id'] = post['_id']['$oid']
        # pprint.pprint(post)
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'post': post
            })
        }
        
    # Get all the posts
    else:
        # Get data from MongoDB
        posts = []
        for post in collection.find():
            # Use json_util for BSON ID
            post = json.loads(json_util.dumps(post))
            # Extract ID string
            post['_id'] = post['_id']['$oid']
            posts.append(post)

    # Must add the following to headers to enable CORS for the Lambda proxy integration
    headers = {'Access-Control-Allow-Origin': '*'}

    # Return format requirements for API Gateway
    response = {
        'statusCode': 200,
        'headers': headers,
        # API Gateway requires only body is JSON
        'body': json.dumps({
            'posts': posts
        })
    }

    return response


if __name__ == '__main__':
    event = {
        'queryStringParameters': {
            'test': 1
        }
    }
    pprint.pprint(lambda_handler(event, ''))
