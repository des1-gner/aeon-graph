import json
import requests
import boto3
import random

def lambda_handler(event, context):
    
    #Used for demo 
    def set_random_sub_claims():
    	dummy_claims = [
    	    "sub_claim-1", "sub_claim-2", "sub_claim-3", "sub_claim-4"]
    	rand_range = random.randrange(0,5)
    	sub_claims = []
    	for x in range(rand_range):
    		sub_claim = random.choice(dummy_claims)
    		sub_claims.append(sub_claim)
    		dummy_claims.remove(sub_claim)
    	return sub_claims
    	
    def set_random_broad_claim():
        dummy_claims = [
            "broad_claim-1", "broad_claim-2", "broad_claim-3", "broad_claim-4"]
        return random.choice(dummy_claims)

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table("lazone")

    API_KEY = "INSERT API KEY HERE"

    base_url = "https://newsapi.org/v2/everything"

    params = {
        "q": "climate change",
        "language": "en",
        "apiKey": API_KEY
    }

    response_data = requests.get(base_url, params=params)

    if response_data.status_code == 200:
        response_json = response_data.json()
        for article in response_json["articles"]:
            item = {
                "title": article.get("title", "No title").lower(),
                "publishedAt": article.get("publishedAt", "No date"),
                "author": article.get("author", "No author"),
                "content": article.get("content", "No content"),
                "description": article.get("description", "No description"),
                "sourceName": article.get("source", {}).get("name", "No source"),
                "url": article.get("url", "No URL"),
                "urlToImage": article.get("urlToImage", "No image URL"),
                "broadClaim": set_random_broad_claim(),
                "subclaims": set_random_sub_claims()
            }
            try:
                table.put_item(Item=item)
                print(f"Successfully added item: {item['title']}")
            except Exception as e:
                print(f"Error adding item {item['title']}: {str(e)}")
    
