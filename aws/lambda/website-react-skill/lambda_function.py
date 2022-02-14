import redis
import boto3
import json
import pprint


SECRET_ID = 'redis'
REGION_NAME = 'us-west-1'


def get_secret(secret_id: str, region_name: str) -> dict:
    session = boto3.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    secret_value = client.get_secret_value(SecretId=secret_id)
    secret_string = secret_value['SecretString']
    return json.loads(secret_string)


# Get secrets
secret = get_secret(secret_id=SECRET_ID, region_name=REGION_NAME)
host = secret['host']
port = secret['port']
password = secret['password']

# Connect to Redis
client_redis = redis.Redis(
    host=host,
    port=port,
    password=password,
    decode_responses=True
)


def lambda_handler(event, context):
    
    headers = { 'Access-Control-Allow-Origin': '*' }
    
    if (
        'queryStringParameters' in event 
        and event['queryStringParameters'] is not None
        and 'id' in event['queryStringParameters']
    ):
        key = event['queryStringParameters']['id']
        
        # Find a single data
        article = client_redis.hgetall(key)
        article['_id'] = key
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'post': article
            })
        }
        
    else:
        
        # Get article IDs by top score descending order
        keys = client_redis.zrevrange(
            name='score:',
            start=0,
            end=-1
        )
        
        # Get articles
        articles = []
        for key in keys:
            
            # HMGET gets a list of values for specified keys
            article_data = client_redis.hmget(key, ['title', 'date', 'category'])
            articles.append({
                '_id': key,
                'title': article_data[0],
                'date': article_data[1],
                'category': article_data[2]
            })
            
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({ 'posts': articles })
        }


if __name__ == '__main__':
    event = {
        'queryStringParameters': {
            'id': 'article:12'
        }
    }
    pprint.pprint(lambda_handler(event, ''))
