"""
LaZone API - DynamoDB Data Retrieval and Filtering Service

Maintainers:
    Primary: Jermaine Portelli (s3935138@student.rmit.edu.au)
    Secondary: 
        - Jasica Jong (s3805999@student.rmit.edu.au)
        - Oisin Aeonn (s3952320@student.rmit.edu.au)

Changelog:
v1.0.0 - Initial Release: Basic DynamoDB scan, simple GET endpoint, 128 items limit
v1.1.0 - Added single date filtering with ISO 8601 validation
v1.2.0 - Added date range filtering (startDate and endDate)
v1.3.0 - Added text search functionality in article body
v1.4.0 - Added single source filtering with validation
v1.5.0 - Added multi-source filtering with comma-separated support
v1.6.0 - Added think tank reference filtering capability
v1.7.0 - Added publisher filtering (Murdoch media support)
v1.8.0 - Added single broad claims filtering
v1.9.0 - Enhanced broad claims with multiple claims support
v1.10.0 - Added custom JSON Decimal encoder
v1.11.0 - Implemented pagination support with LastEvaluatedKey
v1.12.0 - Added detailed error logging and traceback
v1.13.0 - Added filter expression combination logic
v1.14.0 - Added comprehensive CORS headers
v1.15.0 - Added query parameter validation
v1.16.0 - Added empty parameter handling
v1.17.0 - Enhanced DynamoDB error handling
v1.18.0 - Added filter expression debugging
v1.19.0 - Optimized scan operations
v1.20.0 - Added comprehensive logging system
"""

import boto3
import json
import traceback
from boto3.dynamodb.conditions import Attr, And, Or
from botocore.exceptions import ClientError
from datetime import datetime
from decimal import Decimal

# Initialize DynamoDB resource and table
dynamodb = boto3.resource('dynamodb')
table_name = 'lazone'
table = dynamodb.Table(table_name)
MAX_ITEMS = 128  # Maximum number of items to return in a single request

class DecimalEncoder(json.JSONEncoder):
    """
    Custom JSON encoder to handle Decimal types returned by DynamoDB
    Added in v1.10.0 to properly handle numeric data types
    """
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def create_response(status_code, body):
    """
    Creates standardized API response with CORS headers
    Added in v1.0.0, enhanced CORS support in v1.14.0
    
    Args:
        status_code (int): HTTP status code
        body (dict): Response body to be JSON encoded
    
    Returns:
        dict: Formatted API Gateway response
    """
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'OPTIONS,GET,POST'
        },
        'body': json.dumps(body, cls=DecimalEncoder)
    }

def scan_all():
    """
    Retrieves all items from DynamoDB with pagination support
    Added in v1.0.0, enhanced with pagination in v1.11.0
    
    Returns:
        list: List of items from DynamoDB, limited to MAX_ITEMS
    """
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
    """
    Performs filtered scan of DynamoDB with pagination
    Added in v1.3.0, enhanced with multiple filters in v1.13.0
    
    Args:
        filter_expression: DynamoDB filter expression
    
    Returns:
        list: Filtered list of items, limited to MAX_ITEMS
    """
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

def get_filter_expression(filter_expression_list):
    """
    Combines multiple filter expressions using AND operator
    Added in v1.13.0 for complex query support
    
    Args:
        filter_expression_list: List of DynamoDB filter expressions
    
    Returns:
        Combined filter expression
    """
    filter_expression = None
    first = True
    for filter in filter_expression_list:
        if first:
            filter_expression = filter
            first = False
        else:
            filter_expression = filter_expression & filter
    return filter_expression

def filter_by_publisher(publisher):
    """
    Returns list of news sources owned by specified publisher
    Added in v1.7.0 with initial Murdoch media support
    
    Args:
        publisher (str): Publisher identifier
    
    Returns:
        list: List of source domains for the specified publisher
    """
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
    """
    Main Lambda handler function
    Processes API Gateway requests and applies filters based on query parameters
    
    Supported query parameters:
    - startDate: ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
    - endDate: ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
    - search: Text to search in article body
    - sources: Comma-separated list of news sources
    - publisher: Publisher identifier (currently supports 'murdoch media')
    - thinkTankRef: 'true'/'false' to filter articles with/without think tank references
    - broadClaims: Comma-separated list of claim identifiers
    
    Returns:
        dict: API Gateway response with filtered results
    """
    print(f"Received event: {event}")
    # Handle OPTIONS request for CORS
    if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS':
        return create_response(200, {})

    # Extract query parameters
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
        # Build filter expressions based on query parameters
        filter_expressions = []
        
        # Date range filters
        if start_date:
            datetime.strptime(start_date, "%Y-%m-%dT%H:%M:%SZ")
            filter_expressions.append(Attr('dateTime').gte(start_date))
        if end_date:
            datetime.strptime(end_date, "%Y-%m-%dT%H:%M:%SZ")
            filter_expressions.append(Attr('dateTime').lte(end_date))
            
        # Text search filter
        if search:
            filter_expressions.append(Attr('body').contains(search))
            
        # Publisher-based source filter
        if publisher and not sources:
            publisher_source_list = filter_by_publisher(publisher)
            filter_expressions.append(Attr('source').is_in(publisher_source_list))
            
        # Direct source filter
        if sources and not publisher:
            source_list = [s.strip() for s in sources.split(',')]
            filter_expressions.append(Attr('source').is_in(source_list))
            
        # Think tank reference filter
        if think_tank_ref == 'true':
            filter_expressions.append(Attr('think_tank_ref').exists())
        if think_tank_ref == 'false':
            filter_expressions.append(Attr('think_tank_ref').not_exists())
            
        # Broad claims filter
        if broad_claims:
            claims_list = [claim.strip() for claim in broad_claims.split(',')]
            if len(claims_list) > 1:
                conditions = [Attr(f'broadClaims.{claim}').exists() for claim in claims_list]
                if conditions:
                    filter_expressions.append(Or(*conditions))
            else:
                filter_expressions.append(Attr(f'broadClaims.{claims_list[0]}').exists())

        # Apply filters if any exist
        if filter_expressions:
            if len(filter_expressions) > 1:
                filter_expression = get_filter_expression(filter_expressions)
                print("2 filters")
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