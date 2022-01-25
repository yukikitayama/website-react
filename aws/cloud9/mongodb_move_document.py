from pymongo import MongoClient
import boto3
import json
import pprint


SECRET_ID_01 = 'mongodb-website'
REGION_NAME = 'us-west-1'
DATABASE_01 = 'node-angular'
COLLECTION_01 = 'posts'
DATABASE_02 = 'db-react'
COLLECTION_02 = 'skill'


def get_secret(secret_id: str, region_name: str) -> dict:
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    content = client.get_secret_value(SecretId=secret_id)
    secret_string = content['SecretString']
    secret = json.loads(secret_string)
    return secret


def main():
    
    # Get secrets
    secret_mongodb = get_secret(secret_id=SECRET_ID_01, region_name=REGION_NAME)
    cluster = secret_mongodb['mongodb-cluster']
    username = secret_mongodb['mongodb-username']
    password = secret_mongodb['mongodb-password']
    

    # Get documents from post collection and insert to skill collection
    host = f'mongodb+srv://{username}:{password}@{cluster}/{DATABASE_01}?retryWrites=true&w=majority'
    client = MongoClient(host)
    db_post = client[DATABASE_01]
    db_skill = client[DATABASE_02]
    collection_post = db_post[COLLECTION_01]
    collection_skill = db_skill[COLLECTION_02]
    
    for post in collection_post.find():
        del post['_id']
        collection_skill.insert_one(post)
    

if __name__ == '__main__':
    main()
