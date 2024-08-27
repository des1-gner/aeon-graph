import boto3
from boto3.dynamodb.conditions import Attr
from botocore.exceptions import ClientError

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
        'body': body
    }

def lambda_handler(event, context):
    print(f"Received event: {event}")
   
    # Handle API Gateway request
    if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS':
        return create_response(200, {})

    # Extract query parameters from API Gateway event
    query_params = event.get('queryStringParameters', {}) or {}
    
    start_date = query_params.get('startDate')
    end_date = query_params.get('endDate')
    
    try:
        node_limit = int(query_params.get('nodeLimit', 32))
    except ValueError:
        node_limit = 32 
        
    print(f"Start Date: {start_date}")
    print(f"End Date: {end_date}")
    print(f"Node Limit: {node_limit}")

    try:
        filter_expression = None
        if start_date and end_date:
            filter_expression = Attr('publishedAt').between(start_date, end_date)
        elif start_date:
            filter_expression = Attr('publishedAt').gte(start_date)
        elif end_date:
            filter_expression = Attr('publishedAt').lte(end_date)

        scan_params = {
            'Limit': node_limit
        }
        if filter_expression:
            scan_params['FilterExpression'] = filter_expression

        response = table.scan(**scan_params)
        
        items = response.get('Items', [])
        
        print(f"Number of Items Returned: {len(items)}")
        return create_response(200, items)
        
    except ClientError as e:
        print(f"DynamoDB ClientError: {str(e)}")
        return create_response(500, {'error': 'Database operation failed'})
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return create_response(500, {'error': 'An unexpected error occurred'})
