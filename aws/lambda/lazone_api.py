import boto3
import json
import traceback
from boto3.dynamodb.conditions import Attr, And, Or
from botocore.exceptions import ClientError
from datetime import datetime
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table_name = 'lazone'
table = dynamodb.Table(table_name)
MAX_ITEMS = 128

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def create_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'OPTIONS,GET,POST'
        },
        'body': json.dumps(body, cls=DecimalEncoder)  # Use the custom encoder
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
    print(items)
    while 'LastEvaluatedKey' in response and len(items) < MAX_ITEMS:
        response = table.scan(
            FilterExpression=filter_expression,
            ExclusiveStartKey=response['LastEvaluatedKey'],
            Limit=MAX_ITEMS - len(items)
        )
        items.extend(response.get('Items', []))
    return items[:MAX_ITEMS]

# DO NOT TOUCH!
def get_filter_expression(filter_expression_list):
    filter_expression = None
    first = True
    for filter in filter_expression_list:
        if first:
            filter_expression = filter
            first = False
        else:
            filter_expression = filter_expression & filter
    return filter_expression

# This code is used to filter news sources based on the publisher.
# add more if statements in future to add additional publishers.
def filter_by_publisher(publisher):
    if publisher == 'murdoch media':
        return [
            'theaustralian.com.au',
            'news.com.au',
            'heraldsun.com.au',
            'skynews.com.au',
            'dailytelegraph.com.au',
            'couriermail.com.au',
            'nypost.com',
            'wsj.com',
            'foxnews.com'
        ]

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
    sources = query_params.get('sources')
    publisher = query_params.get('publisher')
    think_tank_ref = query_params.get('thinkTankRef')
    broad_claims = query_params.get('broadClaims')

    print(f"Start Date: {start_date}")
    print(f"End Date: {end_date}")
    print(f"Search: {search}")
    print(f"Source: {sources}")
    
    try:
        filter_expressions = []
        # Validate date formats
        if start_date:
            datetime.strptime(start_date, "%Y-%m-%dT%H:%M:%SZ")
            filter_expressions.append(Attr('dateTime').gte(start_date))
        if end_date:
            datetime.strptime(end_date, "%Y-%m-%dT%H:%M:%SZ")
            filter_expressions.append(Attr('dateTime').lte(end_date))
        if search:
            filter_expressions.append(Attr('body').contains(search))
        if publisher and not sources:
            # Generate source list based on publisher
            publisher_source_list = filter_by_publisher(publisher)
            # Add filter expression for multiple sources
            filter_expressions.append(Attr('source').is_in(publisher_source_list))
        # you can search by many news sources with this parameter. for example if you want
        # to search for articles from foxnews and theguardian you would search like so:
        # ?sources=foxnews.com,theguardian.com
        # searches must be comma seperated and include .com
        if sources and not publisher:
            # Split source string by comma and trim whitespace
            source_list = [s.strip() for s in sources.split(',')]
            # Add filter expression for multiple sources
            filter_expressions.append(Attr('source').is_in(source_list))
        if think_tank_ref == 'true':
            filter_expressions.append(Attr('think_tank_ref').exists())
        if think_tank_ref == 'false':
            filter_expressions.append(Attr('think_tank_ref').not_exists())
        if broad_claims:
            #Currently testing
            claims_list = [claim.strip() for claim in broad_claims.split(',')]
            if len(claims_list) > 1:
                conditions = [Attr(f'broadClaims.{claim}').exists() for claim in claims_list]

                # Only create an Or expression if there are conditions to combine
                if conditions:
                    filter_expressions.append(Or(*conditions))
            else:
                # For a single claim, add it directly without Or
                filter_expressions.append(Attr(f'broadClaims.{claims_list[0]}').exists())
        if filter_expressions:
            if len(filter_expressions) > 1:
                filter_expression = get_filter_expression(filter_expressions)
                print("2 filters")
                # filter_expression = And(*filter_expressions)
            else:
                filter_expression = filter_expressions[0]
                print("1 filter")
            
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