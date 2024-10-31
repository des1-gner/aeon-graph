"""
DynamoDB Data Upload Script

This script loads climate news data from a JSON file and uploads it to AWS DynamoDB.
It includes data processing, error handling, and upload verification functionality.

Prerequisites:
- AWS credentials configured with DynamoDB access
- boto3 library installed
- Valid climate_news_data.json file in the same directory
- DynamoDB table 'lazone' created in ap-southeast-2 region

Author: Oisin Aeonn
Last Updated: 30/10/2024
"""

import json
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key

# Initialize DynamoDB client in Sydney region
dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2')

# Configure target DynamoDB table
table_name = 'lazone'
table = dynamodb.Table(table_name)

# Load JSON data from local file
with open('climate_news_data.json', 'r') as file:
    data = json.load(file)

def process_value(value):
    """
    Recursively process DynamoDB attribute values to convert them to standard Python types.
    
    Args:
        value: The value to process (can be dict, list, or primitive type)
        
    Returns:
        Processed value in appropriate Python type
    """
    if isinstance(value, dict):
        if 'S' in value:  # String type
            return value['S']
        elif 'N' in value:  # Number type
            return int(value['N'])
        elif 'BOOL' in value:  # Boolean type
            return value['BOOL']
        elif 'M' in value:  # Map type
            return {k: process_value(v) for k, v in value['M'].items()}
        else:  # Generic dictionary
            return {k: process_value(v) for k, v in value.items()}
    elif isinstance(value, list):
        return [process_value(item) for item in value]
    else:
        return value

def upload_item(item):
    """
    Upload a single item to DynamoDB with error handling.
    
    Args:
        item: Dictionary containing item data
        
    Returns:
        bool: True if upload successful, False otherwise
    """
    try:
        # Validate required fields
        if 'articleId' not in item:
            print(f"Skipping item: Missing articleId")
            return False

        # Clean and process item data
        cleaned_item = {key: process_value(value) for key, value in item.items()}
        
        # Perform DynamoDB put_item operation
        table.put_item(Item=cleaned_item)
        print(f"Successfully uploaded article {cleaned_item['articleId']}")
        return True

    except ClientError as e:
        print(f"Error uploading article {item.get('articleId', {}).get('N', 'unknown')}: {e.response['Error']['Message']}")
        return False
    except Exception as e:
        print(f"Unexpected error uploading article {item.get('articleId', {}).get('N', 'unknown')}: {str(e)}")
        return False

# Main execution block: Upload all items and track statistics
successful_uploads = 0
failed_uploads = 0

for item in data:
    if upload_item(item):
        successful_uploads += 1
    else:
        failed_uploads += 1

# Print upload statistics
print(f"\nUpload Summary:")
print(f"Successfully uploaded: {successful_uploads}")
print(f"Failed uploads: {failed_uploads}")
print(f"Total items processed: {len(data)}")

# Verify upload by querying a sample item
try:
    # Use first article's ID as verification sample
    sample_id = int(data[0]['articleId']['N'])
    response = table.query(
        KeyConditionExpression=Key('articleId').eq(sample_id)
    )
    
    if response['Items']:
        print(f"\nVerification successful: Found article with ID {sample_id}")
        print(f"Number of items found: {len(response['Items'])}")
        print("Sample item structure:")
        print(json.dumps(response['Items'][0], indent=2))
    else:
        print(f"\nVerification failed: No article found with ID {sample_id}")

except ClientError as e:
    print(f"\nError querying table: {e.response['Error']['Message']}")
except Exception as e:
    print(f"\nUnexpected error during verification: {str(e)}")