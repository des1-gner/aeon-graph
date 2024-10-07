import json
import boto3
from botocore.exceptions import ClientError

# Initialize a DynamoDB client
dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2')

# Specify your table name
table_name = 'lazone'
table = dynamodb.Table(table_name)

# Load the JSON data
with open('climate_news_data.json', 'r') as file:
    data = json.load(file)

# Function to upload an item to DynamoDB
def upload_item(item):
    try:
        # Ensure title and publishedAt are present
        if 'title' not in item or 'publishedAt' not in item:
            print(f"Skipping item: Missing title or publishedAt")
            return False

        # Remove the 'S' wrapper from each attribute
        for key, value in item.items():
            if isinstance(value, dict) and 'S' in value:
                item[key] = value['S']
        
        # Upload the item
        table.put_item(Item=item)
        return True
    except ClientError as e:
        print(f"Error uploading item: {e.response['Error']['Message']}")
        return False

# Upload each item to DynamoDB
successful_uploads = 0
for item in data:
    if upload_item(item):
        successful_uploads += 1

print(f"Successfully uploaded {successful_uploads} out of {len(data)} items to DynamoDB table {table_name}")

# Optional: Verify the upload by querying the table
try:
    # Query for a specific title (replace with an actual title from your data)
    sample_title = data[0]['title']['S']
    response = table.query(
        KeyConditionExpression=Key('title').eq(sample_title)
    )
    items = response['Items']
    print(f"Query result for title '{sample_title}': {len(items)} items found")
except ClientError as e:
    print(f"Error querying table: {e.response['Error']['Message']}")
