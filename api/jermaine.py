import boto3
from boto3.dynamodb.conditions import Key, Attr
import json

def query_articles_by_partial_key(search_term):
    # Initialize DynamoDB client
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('lazone')

    # Perform a scan operation with a filter
    response = table.scan(
        FilterExpression=Attr('title').contains(search_term))

    # Extract and return the matching items
    items = response['Items']

    # Handle pagination if there are more results
    while 'LastEvaluatedKey' in response:
        response = table.scan(
            FilterExpression=Attr('title').contains(search_term),
            ExclusiveStartKey=response['LastEvaluatedKey']
        )
        items.extend(response['Items'])
    return {
    'count': len(items),
    'items': items
    }
    
def create_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'OPTIONS,GET,POST'
        },
        'body': body
    }

def lambda_handler(event, context):
    if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS':
        return create_response(200, {})

    # Extract query parameters from API Gateway event
    try:
        query_params = event.get('queryStringParameters', {}) or {}
        search = query_params.get('search').lower()
        result = query_articles_by_partial_key(search)
        
        return {
        'statusCode': 200,
        'body': result
        }
        
    except ClientError as e:
        print(f"DynamoDB ClientError: {str(e)}")
        return create_response(500, {'error': 'Database operation failed'})
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return create_response(500, {'error': 'An unexpected error occurred'})
