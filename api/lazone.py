import boto3
import json
from boto3.dynamodb.conditions import Attr
from botocore.exceptions import ClientError
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table_name = 'lazone'
table = dynamodb.Table(table_name)

def create_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'OPTIONS,GET,POST'
        },
        'body': json.dumps(body)
    }

def scan_all():
    response = table.scan()
    items = response.get('Items', [])
    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        items.extend(response['Items'])
    return items

def scan_specific(filter_expression):
    response = table.scan(FilterExpression=filter_expression)
    items = response.get('Items', [])
    while 'LastEvaluatedKey' in response:
        response = table.scan(
            FilterExpression=filter_expression,
            ExclusiveStartKey=response['LastEvaluatedKey']
        )
        items.extend(response['Items'])
    return items

def lambda_handler(event, context):
    print(f"Received event: {event}")

    # Handle API Gateway request
    if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS':
        return create_response(200, {})

    # Extract query parameters from API Gateway event
    query_params = event.get('queryStringParameters', {}) or {}
    
    start_date = query_params.get('startDate')
    end_date = query_params.get('endDate')
    print(f"Start Date: {start_date}")
    print(f"End Date: {end_date}")

    try:
        # Validate date formats
        if start_date:
            datetime.strptime(start_date, "%Y-%m-%dT%H:%M:%SZ")
        if end_date:
            datetime.strptime(end_date, "%Y-%m-%dT%H:%M:%SZ")

        if start_date and end_date:
            filter_expression = Attr('publishedAt').between(start_date, end_date)
            items = scan_specific(filter_expression)
        elif start_date:
            filter_expression = Attr('publishedAt').gte(start_date)
            items = scan_specific(filter_expression)
        elif end_date:
            filter_expression = Attr('publishedAt').lte(end_date)
            items = scan_specific(filter_expression)
        else:
            items = scan_all()

        print(f"Number of Items Returned: {len(items)}")
        return create_response(200, items)
        
    except ValueError as e:
        print(f"Date format error: {str(e)}")
        return create_response(400, {'error': 'Invalid date format. Use ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ'})
    except ClientError as e:
        print(f"DynamoDB ClientError: {str(e)}")
        return create_response(500, {'error': 'Database operation failed'})
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return create_response(500, {'error': 'An unexpected error occurred'})
