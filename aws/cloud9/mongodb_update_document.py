from pymongo import MongoClient
import boto3
import json
import pprint


SECRET_ID_01 = 'mongodb-website'
REGION_NAME = 'us-west-1'
DATABASE = 'stack-exchange'
COLLECTION = 'stack-overflow'


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
    
    # MongoDB client
    host = f'mongodb+srv://{username}:{password}@{cluster}/{DATABASE}?retryWrites=true&w=majority'
    client = MongoClient(host)
    db = client[DATABASE]
    collection = db[COLLECTION]

    # Query and update documents
    query = { 'tag-to-count': { '$exists': True } }
    for doc in collection.find(query):
        
        # Make the data for update
        tag_to_count = doc['tag-to-count']
        count_tag = []
        for k, v in sorted(tag_to_count.items(), key=lambda x: x[1], reverse=True):
            count_tag.append({ 'tag': k, 'count': v })

        # Update document in MongoDB
        collection.update_one(
            { '_id': doc['_id'] }, 
            { 
                '$set': { 'count-tag': count_tag },
                '$unset': { 'tag-to-count': 1 }
            }
        )

    
if __name__ == '__main__':
    main()