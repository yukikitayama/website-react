from pymongo import MongoClient
from bson.objectid import ObjectId
import redis
import boto3
import json
import pprint


SECRET_ID_01 = 'mongodb-website'
SECRET_ID_02 = 'redis'
REGION_NAME = 'us-west-1'
DATABASE_MONGODB = 'db-react'
COLLECTION = 'skill'
ID_MONGODB = ''
KEY_REDIS = ''


def get_secret(secret_id: str, region_name: str) -> dict:
    session = boto3.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    secret_value = client.get_secret_value(SecretId=secret_id)
    secret_string = secret_value['SecretString']
    return json.loads(secret_string)


def main():
    
    # Get secrets
    secret_mongodb = get_secret(secret_id=SECRET_ID_01, region_name=REGION_NAME)
    cluster_mongodb = secret_mongodb['mongodb-cluster']
    username_mongodb = secret_mongodb['mongodb-username']
    password_mongodb = secret_mongodb['mongodb-password']
    
    secret_redis = get_secret(secret_id=SECRET_ID_02, region_name=REGION_NAME)
    host_redis = secret_redis['host']
    port_redis = secret_redis['port']
    password_redis = secret_redis['password']
    
    # Connect to MongoDB
    client_mongodb = MongoClient(
        f'mongodb+srv://{username_mongodb}:{password_mongodb}@{cluster_mongodb}/{DATABASE_MONGODB}?retryWrites=true&w=majority'
    )
    db_mongodb = client_mongodb[DATABASE_MONGODB]
    collection = db_mongodb[COLLECTION]
    
    # Connect to Redis
    client_redis = redis.Redis(
        host=host_redis,
        port=port_redis,
        password=password_redis,
        decode_responses=True
    )
    
    # Get one document from MongoDB
    # document = collection.find_one({ '_id': ObjectId(ID_MONGODB) })
    # pprint.pprint(document)

    # Upload the data to Redis
    # mapping = {
    #     'title': document['title'],
    #     'category': document['category'],
    #     'date': document['date'],
    #     'content': document['content'],
    #     'vote': 0
    # }
    # result = client_redis.hset(name=KEY_REDIS, mapping=mapping)
    # print(f'HSET: {result}')


if __name__ == '__main__':
    main()
