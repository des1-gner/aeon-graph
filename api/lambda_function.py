import json
import boto3
from boto3.dynamodb.conditions import Attr, And

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table_name = 'lazone'
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    # Get query parameters from the event
    query_params = event.get('queryStringParameters', {})
    
    start_date = query_params.get('startDate')
    end_date = query_params.get('endDate')
    author = query_params.get('author')
    keyword = query_params.get('keyword')
    source_name = query_params.get('sourceName')
    
    try:
        # Build the filter expression dynamically
        filter_expression = None
        
        # Date filtering conditions
        if start_date and end_date:
            filter_expression = Attr('publishedAt').between(start_date, end_date)
        elif start_date:
            filter_expression = Attr('publishedAt').gte(start_date)
        elif end_date:
            filter_expression = Attr('publishedAt').lte(end_date)
        
        # Filtering by author
        if author:
            author_condition = Attr('author').eq(author)
            filter_expression = And(filter_expression, author_condition) if filter_expression else author_condition
        
        # Filtering by keyword in title, content, or description
        if keyword:
            keyword_condition = (
                Attr('title').contains(keyword) |
                Attr('content').contains(keyword) |
                Attr('description').contains(keyword)
            )
            filter_expression = And(filter_expression, keyword_condition) if filter_expression else keyword_condition
        
        # Filtering by source name
        if source_name:
            source_name_condition = Attr('sourceName').eq(source_name)
            filter_expression = And(filter_expression, source_name_condition) if filter_expression else source_name_condition
        
        # Filtering for non-null urlToImage
        url_image_condition = Attr('urlToImage').exists()
        filter_expression = And(filter_expression, url_image_condition) if filter_expression else url_image_condition
        
        # Perform the scan with the dynamically built filter expression
        scan_args = {'Limit': 64}  # Adjust limit as needed
        if filter_expression:
            scan_args['FilterExpression'] = filter_expression
        
        response = table.scan(**scan_args)
        items = response.get('Items', [])
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'  # Allow cross-origin requests
            },
            'body': json.dumps(items)
        }
        
    except Exception as e:
        # Handle any errors that may occur during scanning
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'  # Allow cross-origin requests
            },
            'body': json.dumps({'error': str(e)})
        }
