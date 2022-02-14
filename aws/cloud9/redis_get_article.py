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


def get_articles(conn: redis.Redis, order: str):
    # Get keys in ZSET in reverse order
    keys = conn.zrevrange(
        name=order, 
        start=0,
        end=-1
    )
    
    # Get articles
    articles = []
    for key in keys:
        # Get HASH name/value pairs as Python dictionary
        article_data = conn.hgetall(key)
        article_data['id'] = key
        articles.append(article_data)
    
    return articles


def main():
    
    # Get secrets
    secret = get_secret(secret_id=SECRET_ID, region_name=REGION_NAME)
    host = secret['host']
    port = secret['port']
    password = secret['password']
    
    # Connect to Redis
    client = redis.Redis(
        host=host,
        port=port,
        password=password,
        decode_responses=True
    )
    
    # Forgot vote order, so setting here once
    # Score is just vote
    # print('DEL ', client.delete('score:'))
    # print('ZADD article:1 ', client.zadd('score:', { 'article:1': 0 }))
    # print('ZADD article:12 ', client.zadd('score:', { 'article:12': 1 }))
    
    # Get article from top vote
    articles = get_articles(conn=client, order='score:')
    print(f'len(articles): {len(articles)}')
    pprint.pprint(articles)


if __name__ == '__main__':
    main()
