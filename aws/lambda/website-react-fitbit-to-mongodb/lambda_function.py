from pymongo import MongoClient
import requests
import boto3
import base64
import json
from datetime import datetime, timedelta
import pprint


SECRET_NAME_01 = 'fitbit'
SECRET_NAME_02 = 'mongodb-website'
REGION_NAME = 'us-west-1'
DATABASE = 'fitbit'


def get_secret(region_name: str, secret_name: str) -> dict:
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    secret_value = client.get_secret_value(SecretId=secret_name)
    secret_string = secret_value['SecretString']
    secret = json.loads(secret_string)
    return secret


def update_secret(region_name: str, secret_name: str, secret_key_pair: str) -> dict:
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    response = client.update_secret(
        SecretId=secret_name,
        SecretString=secret_key_pair
    )
    return response


def refresh_access_token(basic_token: str, refresh_token: str) -> dict:
    headers = {
        'Authorization': f'Basic {basic_token}',
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    data = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }
    response = requests.post('https://api.fitbit.com/oauth2/token', headers=headers, data=data)
    response_json = response.json()
    return response_json


def update_aws_secrets_manager(
        new_access_token: str,
        new_refresh_token: str,
        encoded_id: str,
        client_id: str,
        client_secret: str
) -> dict:
    secret_key_pair = f'{{' \
                      f'"access-token": "{new_access_token}", ' \
                      f'"refresh-token": "{new_refresh_token}", ' \
                      f'"encoded-id": "{encoded_id}", ' \
                      f'"client-id": "{client_id}", ' \
                      f'"client-secret": "{client_secret}"' \
                      f'}}'
    response = update_secret(
        region_name=REGION_NAME,
        secret_name=SECRET_NAME_01,
        secret_key_pair=secret_key_pair
    )
    return response


def lambda_handler(event, context):
    
    # Get secrets
    
    # Fitbit
    secret_fitbit = get_secret(REGION_NAME, SECRET_NAME_01)
    access_token = secret_fitbit['access-token']
    encoded_id = secret_fitbit['encoded-id']
    refresh_token = secret_fitbit['refresh-token']
    client_id = secret_fitbit['client-id']
    client_secret = secret_fitbit['client-secret']
    
    # MongoDB
    secret_mongodb = get_secret(REGION_NAME, SECRET_NAME_02)
    cluster = secret_mongodb['mongodb-cluster']
    username = secret_mongodb['mongodb-username']
    password = secret_mongodb['mongodb-password']
    
    # MongoDB client
    host = f'mongodb+srv://{username}:{password}@{cluster}/{DATABASE}?retryWrites=true&w=majority'
    client = MongoClient(host)
    db = client[DATABASE]
        
    # Test whether the access token is expired
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = requests.get(f'https://api.fitbit.com/1/user/{encoded_id}/profile.json', headers=headers)
    print(f'Status code: {response.status_code}')
    # pprint.pprint(response.json())
    
    # Refresh access token if it's expired
    if response.status_code == 401 and response.json()['errors'][0]['errorType'] == 'expired_token':
        print('Access token expired')
        
        # Create basic token
        basic_token = base64.b64encode(f'{client_id}:{client_secret}'.encode()).decode()

        # Refresh token
        response_json = refresh_access_token(
            refresh_token=refresh_token,
            basic_token=basic_token
        )
        print(f'Refreshed access token')
        # pprint.pprint(response_json)

        # Update AWS Secrets Manager
        new_access_token = response_json['access_token']
        new_refresh_token = response_json['refresh_token']
        response = update_aws_secrets_manager(
            new_access_token=new_access_token,
            new_refresh_token=new_refresh_token,
            encoded_id=encoded_id,
            client_id=client_id,
            client_secret=client_secret
        )
        print('Updated AWS Secrets Manager')
        # pprint.pprint(response)
        
        # Update access token variable
        access_token = new_access_token
    
    # Make date
    date = (datetime.utcnow() - timedelta(days=1)).strftime('%Y-%m-%d')
    print(f'Date: {date}')
    
    # Make headers for fitbit API
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    
    # Sleep
    r = requests.get(
        url=f'https://api.fitbit.com/1.2/user/{encoded_id}/sleep/date/{date}.json',
        headers=headers
    )
    print(f'Sleep status code: {r.status_code}')
    data = r.json()
    data['date'] = date
    # pprint.pprint(data)
    collection = db['sleep-log']
    result = collection.insert_one(data)
    print(f'Sleep inserted document id: {result.inserted_id}')
    
    # Heart rate
    r = requests.get(
        url=f'https://api.fitbit.com/1/user/{encoded_id}/activities/heart/date/{date}/1d.json',
        headers=headers
    )
    print(f'Heart rate status code: {r.status_code}')
    data = r.json()
    data['date'] = date
    # pprint.pprint(data.keys())
    collection = db['heart-rate']
    result = collection.insert_one(data)
    print(f'Heart rate inserted document id: {result.inserted_id}')
    
    # Activity steps taken
    r = requests.get(
        url=f'https://api.fitbit.com/1/user/{encoded_id}/activities/steps/date/{date}/1d.json',
        headers=headers
    )
    print(f'Activity steps status code: {r.status_code}')
    data = r.json()
    data['date'] = date
    # pprint.pprint(data)
    collection = db['activity-steps']
    result = collection.insert_one(data)
    print(f'Activity steps inserted document id: {result.inserted_id}')
    
    # Activity calories burned
    r = requests.get(
        url=f'https://api.fitbit.com/1/user/{encoded_id}/activities/calories/date/{date}/1d.json',
        headers=headers
    )
    print(f'Activity calories status code: {r.status_code}')
    data = r.json()
    data['date'] = date
    # pprint.pprint(data)
    collection = db['activity-calories']
    result = collection.insert_one(data)
    print(f'Activity calories inserted document id: {result.inserted_id}')
    
    # Body weight
    r = requests.get(
        url=f'https://api.fitbit.com/1/user/{encoded_id}/body/log/weight/date/{date}.json',
        headers=headers
    )
    print(f'Weight log status code: {r.status_code}')
    data = r.json()
    data['date'] = date
    # pprint.pprint(data)
    collection = db['weight-log']
    result = collection.insert_one(data)
    print(f'Weight log inserted document id: {result.inserted_id}')
    
    # Nutrition water log
    r = requests.get(
        url=f'https://api.fitbit.com/1/user/{encoded_id}/foods/log/water/date/{date}.json',
        headers=headers
    )
    print(f'Water log status code: {r.status_code}')
    data = r.json()
    data['date'] = date
    # pprint.pprint(data)
    collection = db['water-log']
    result = collection.insert_one(data)
    print(f'Water log inserted document id: {result.inserted_id}')


if __name__ == '__main__':
    pprint.pprint(lambda_handler('', ''))
