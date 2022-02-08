from pymongo import MongoClient
from stackapi import StackAPI
import boto3
import json
from datetime import datetime, timedelta
import collections
import time
import pprint


SECRET_NAME_01 = 'stack-exchange'
SECRET_NAME_02 = 'mongodb-website'
REGION_NAME = 'us-west-1'
DATABASE = 'stack-exchange'
COLLECTION = 'stack-overflow'
SITE = 'stackoverflow'


def get_secret(region_name: str, secret_name: str) -> dict:
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    secret_value = client.get_secret_value(SecretId=secret_name)
    secret_string = secret_value['SecretString']
    secret = json.loads(secret_string)
    return secret
    

def lambda_handler(event, context):
    
    start_time = time.time()
    
    # Get secrets
    secret_stack_exchange = get_secret(secret_name=SECRET_NAME_01, region_name=REGION_NAME)
    key = secret_stack_exchange['key']
    
    # MongoDB
    secret_mongodb = get_secret(secret_name=SECRET_NAME_02, region_name=REGION_NAME)
    cluster = secret_mongodb['mongodb-cluster']
    username = secret_mongodb['mongodb-username']
    password = secret_mongodb['mongodb-password']
    
    # MongoDB client
    host = f'mongodb+srv://{username}:{password}@{cluster}/{DATABASE}?retryWrites=true&w=majority'
    client = MongoClient(host)
    db = client[DATABASE]
    collection = db[COLLECTION]
    
    # Make parameter
    from_datetime = (datetime.utcnow() - timedelta(days=1))
    to_datetime = from_datetime + timedelta(hours=1)
    print(f'from_datetime: {from_datetime}, to_datetime: {to_datetime}')
    fromdate = int(from_datetime.timestamp())
    todate = int(to_datetime.timestamp())
    sort = 'votes'
    order = 'desc'
    max_pages = 100
    page_size = 100
    
    # Stack API
    site = StackAPI(
        name=SITE, 
        key=key, 
        max_pages=max_pages,
        page_size=page_size
    )
    result = site.fetch(
        endpoint='questions',
        fromdate=fromdate,
        todate=todate,
        sort=sort,
        order=order
    )
    print(f'Number of items: {len(result["items"])}')
    count_question = len(result['items'])
    tag_to_count = collections.defaultdict(int)
    for item in result['items']:
        tags = item['tags']
        for tag in tags:
            tag_to_count[tag] += 1
            
    count_tag = []
    for k, v in sorted(tag_to_count.items(), key=lambda x: x[1], reverse=True):
        count_tag.append({ 'tag': k, 'count': v})

    # Upload to MongoDB
    document = {}
    document['from-date'] = from_datetime
    document['to-date'] = to_datetime
    document['count-question'] = count_question
    document['count-tag'] = count_tag
    document['creation-datetime'] = datetime.utcnow()
    result = collection.insert_one(document)
    print(f'Document ID: {result.inserted_id}')
    
    end_time = time.time()
    print(f'Time: {(end_time - start_time) / 60:.1} minutes')


if __name__ == '__main__':
    pprint.pprint(lambda_handler('', ''))
