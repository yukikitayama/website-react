import redis
import boto3
import json
import pprint


SECRED_ID = 'redis'
REGION_NAME = 'us-west-1'


def get_secret(secret_id: str, region_name: str) -> dict:
    session = boto3.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    secret_value = client.get_secret_value(SecretId=secret_id)
    secret_string = secret_value['SecretString']
    return json.loads(secret_string)


def main():

    # Get secret
    secret = get_secret(secret_id=SECRED_ID, region_name=REGION_NAME)
    host = secret['host']
    port = secret['port']
    password = secret['password']

    # Redis client
    redis_client = redis.Redis(
        host=host,
        port=port,
        password=password,
        decode_responses=True
    )
    
    # Check ZSET
    # result = redis_client.zrange('score:', 0, -1, withscores=True)
    # pprint.pprint(result)
    
    # Update ZSET
    print('article:12', redis_client.zadd(name='score:', mapping={ 'article:12': 12 }))
    print('article:11', redis_client.zadd(name='score:', mapping={ 'article:11': 11 }))
    print('article:2', redis_client.zadd(name='score:', mapping={ 'article:2': 10 }))
    print('article:4', redis_client.zadd(name='score:', mapping={ 'article:4': 9 }))
    print('article:1', redis_client.zadd(name='score:', mapping={ 'article:1': 8 }))
    print('article:8', redis_client.zadd(name='score:', mapping={ 'article:8': 7 }))
    print('article:3', redis_client.zadd(name='score:', mapping={ 'article:3': 6 }))


    


if __name__ == '__main__':
    main()
