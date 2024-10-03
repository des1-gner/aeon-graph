import boto3
import json
import traceback
from boto3.dynamodb.conditions import Attr, And
from botocore.exceptions import ClientError
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table_name = 'lazone'
table = dynamodb.Table(table_name)
MAX_ITEMS = 128

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
    items = []
    response = table.scan(Limit=MAX_ITEMS)
    items.extend(response.get('Items', []))
    while 'LastEvaluatedKey' in response and len(items) < MAX_ITEMS:
        response = table.scan(
            ExclusiveStartKey=response['LastEvaluatedKey'],
            Limit=MAX_ITEMS - len(items)
        )
        items.extend(response.get('Items', []))
    return items[:MAX_ITEMS]

def scan_specific(filter_expression):
    items = []
    response = table.scan(FilterExpression=filter_expression, Limit=MAX_ITEMS)
    items.extend(response.get('Items', []))
    while 'LastEvaluatedKey' in response and len(items) < MAX_ITEMS:
        response = table.scan(
            FilterExpression=filter_expression,
            ExclusiveStartKey=response['LastEvaluatedKey'],
            Limit=MAX_ITEMS - len(items)
        )
        items.extend(response.get('Items', []))
    return items[:MAX_ITEMS]

def lambda_handler(event, context):
    print(f"Received event: {event}")
    # Handle API Gateway request
    if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS':
        return create_response(200, {})

    # Extract query parameters from API Gateway event
    query_params = event.get('queryStringParameters', {}) or {}
    
    start_date = query_params.get('startDate')
    end_date = query_params.get('endDate')
    search = query_params.get('search')
    column_exists = query_params.get('columnExists')  # New parameter
    print(f"Start Date: {start_date}")
    print(f"End Date: {end_date}")
    print(f"Search: {search}")
    print(f"Column Exists: {column_exists}")

    try:
        filter_expressions = []
        # Validate date formats
        if start_date:
            datetime.strptime(start_date, "%Y-%m-%dT%H:%M:%SZ")
            filter_expressions.append(Attr('publishedAt').gte(start_date))
        if end_date:
            datetime.strptime(end_date, "%Y-%m-%dT%H:%M:%SZ")
            filter_expressions.append(Attr('publishedAt').lte(end_date))
        if search:
            filter_expressions.append(Attr('content').contains(search))
        if column_exists:
            filter_expressions.append(Attr(column_exists).exists())  # New filter

        if filter_expressions:
            if len(filter_expressions) > 1:
                filter_expression = And(*filter_expressions)
            else:
                filter_expression = filter_expressions[0]
            
            print(f"Filter expression: {filter_expression.get_expression()}")
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
        return create_response(500, {'error': 'Database operation failed', 'details': str(e)})
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return create_response(500, {'error': 'An unexpected error occurred', 'details': str(e), 'traceback': traceback.format_exc()})