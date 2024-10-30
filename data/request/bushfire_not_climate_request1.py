import requests
import json
import uuid

def fetch_bushfire_news(api_key: str, start_date: str, end_date: str, urls: list) -> list:
    """
    Fetches bushfire-related news articles from specified sources within a date range.
    
    Uses NewsAPI.ai to retrieve articles about bushfires while excluding climate change
    related terms. Implements pagination to fetch all available articles.
    
    Args:
        api_key: NewsAPI.ai authentication key
        start_date: Start date in 'YYYY-MM-DD' format
        end_date: End date in 'YYYY-MM-DD' format
        urls: List of news source URLs to search
    
    Returns:
        List of dictionaries containing article information
    """
    url = "https://newsapi.ai/api/v1/article/getArticles"
    
    # Construct query payload with search parameters and filters
    payload = {
        "query": {
            "$query": {
                "$and": [
                    {
                        # Search for bushfire terms while excluding climate-related terms
                        "keyword": "(bushfire or bushfires) not (\"climate\" or \"global warming\" or \"global warmings\" or \"global \nwarming's\" or \"emissions\" or \"emission\" or \"fossil fuels\" or \"fossil fuel\" or \"net zero\" or \n\"renewable energy\" or \"renewable energies\" or \"greenhouse\" or \"alarmism\" or \"IPCC\" or \n\"protest\" or \"protests\" or \"crazies\" or \"activists\")",
                        "keywordSearchMode": "exact"
                    },
                    {
                        "dateStart": start_date,
                        "dateEnd": end_date
                    },
                    {
                        # Create OR conditions for each source URL
                        "$or": [{"sourceUri": source_url} for source_url in urls]
                    }
                ]
            }
        },
        "resultType": "articles",
        "articlesSortBy": "date",
        "includeArticleImage": True,
        "apiKey": api_key,
        "articlesPage": 1,
        "articlesCount": 100  # Articles per page
    }
    
    all_articles_info = []
    total_articles = 0
    current_page = 1

    # Fetch articles using pagination until all results are retrieved
    while True:
        payload["articlesPage"] = current_page
        
        try:
            # Make API request
            response = requests.post(url, json=payload)
            response.raise_for_status()
            
            data = response.json()import requests
import json
import uuid

def fetch_bushfire_news(api_key, start_date, end_date, urls):
    url = "https://newsapi.ai/api/v1/article/getArticles"
    
    payload = {
        "query": {
            "$query": {
                "$and": [
                    {
                        "keyword": "(bushfire or bushfires) not (\"climate\" or \"global warming\" or \"global warmings\" or \"global \nwarming's\" or \"emissions\" or \"emission\" or \"fossil fuels\" or \"fossil fuel\" or \"net zero\" or \n\"renewable energy\" or \"renewable energies\" or \"greenhouse\" or \"alarmism\" or \"IPCC\" or \n\"protest\" or \"protests\" or \"crazies\" or \"activists\")",
                        "keywordSearchMode": "exact"
                    },
                    {
                        "dateStart": start_date,
                        "dateEnd": end_date
                    },
                    {
                        "$or": [{"sourceUri": source_url} for source_url in urls]
                    }
                ]
            }
        },
        "resultType": "articles",
        "articlesSortBy": "date",
        "includeArticleImage": True,
        "apiKey": api_key,
        "articlesPage": 1,
        "articlesCount": 100  # We'll use this as our page size
    }
    
    all_articles_info = []
    total_articles = 0
    current_page = 1

    while True:
        payload["articlesPage"] = current_page
        
        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()
            
            data = response.json()
            
            if 'articles' in data:
                articles = data['articles'].get('results', [])
                total_results = data['articles'].get('totalResults', 0)
                
                print(f"Fetching page {current_page}. Articles on this page: {len(articles)}")
                
                for art in articles:
                    if isinstance(art, dict):
                        authors = art.get('authors', [])
                        if isinstance(authors, list):
                            authors_str = ', '.join(author.get('name', '') for author in authors if isinstance(author, dict))
                        else:
                            authors_str = str(authors)

                        article_info = {
                            "title": art.get('title', ''),
                            "dateTime": art.get('dateTimePub', ''),
                            "authors": authors_str,
                            "image": art.get('image', ''),
                            "body": art.get('body', ''),
                            "source": art.get('source', {}).get('title', ''),
                            "url": art.get('url', ''),
                            "uri": f"uri-{uuid.uuid4().hex[:8]}",
                            "isDuplicate": art.get('isDuplicate', False)
                        }
                        all_articles_info.append(article_info)
                    else:
                        print(f"Unexpected article format: {art}")
                
                total_articles += len(articles)
                
                if total_articles >= total_results:
                    print(f"Fetched all available articles. Total: {total_articles}")
                    break
                
                current_page += 1
            else:
                print("No articles found in the response.")
                break
            
        except requests.exceptions.RequestException as e:
            print(f"Error making request: {e}")
            if hasattr(e, 'response') and e.response:
                print(f"Response text: {e.response.text}")
            break
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON response: {e}")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")
            break
    
    return all_articles_info

def main():

    api_key = 'XXXXXXXXXXXXXXXXX' # ommited due to security

    start_date = "2019-12-01"
    end_date = "2019-12-05"
    urls = [
        "theguardian.com", "abc.net.au", "news.com.au", "heraldsun.com.au", "skynews.com.au",
        "afr.com", "smh.com.au", "dailytelegraph.com.au", "foxnews.com", "nytimes.com",
        "dailywire.com", "couriermail.com.au", "thewest.com.au", "7news.com.au", "9news.com.au",
        "theconversation.com", "nypost.com", "wsj.com", "wattsupwiththat.com", "breitbart.com",
        "newsmax.com", "naturalnews.com", "washingtontimes.com", "infowars.com"
    ]
    
    print("Fetching articles...")
    all_articles_info = fetch_bushfire_news(api_key, start_date, end_date, urls)
    
    filename = "BushfireRelatedArticlesREQUEST1.json"
    try:
        with open(filename, 'w', encoding='utf-8') as json_file:
            json.dump(all_articles_info, json_file, indent=4, ensure_ascii=False)
        print(f"All articles saved to '{filename}'")
    except Exception as e:
        print(f"Error saving articles to JSON file: {e}")
    
    print(f"\nTotal articles collected: {len(all_articles_info)}")

if __name__ == "__main__":
    main()
            
            if 'articles' in data:
                articles = data['articles'].get('results', [])
                total_results = data['articles'].get('totalResults', 0)
                
                print(f"Fetching page {current_page}. Articles on this page: {len(articles)}")
                
                # Process each article
                for art in articles:
                    if isinstance(art, dict):
                        # Handle author information
                        authors = art.get('authors', [])
                        if isinstance(authors, list):
                            authors_str = ', '.join(author.get('name', '') for author in authors if isinstance(author, dict))
                        else:
                            authors_str = str(authors)

                        # Extract and structure article information
                        article_info = {
                            "title": art.get('title', ''),
                            "dateTime": art.get('dateTimePub', ''),
                            "authors": authors_str,
                            "image": art.get('image', ''),
                            "body": art.get('body', ''),
                            "source": art.get('source', {}).get('title', ''),
                            "url": art.get('url', ''),
                            "uri": f"uri-{uuid.uuid4().hex[:8]}", # Generate unique identifier
                            "isDuplicate": art.get('isDuplicate', False)
                        }
                        all_articles_info.append(article_info)
                    else:
                        print(f"Unexpected article format: {art}")
                
                total_articles += len(articles)
                
                # Check if all articles have been fetched
                if total_articles >= total_results:
                    print(f"Fetched all available articles. Total: {total_articles}")
                    break
                
                current_page += 1
            else:
                print("No articles found in the response.")
                break
            
        except requests.exceptions.RequestException as e:
            print(f"Error making request: {e}")
            if hasattr(e, 'response') and e.response:
                print(f"Response text: {e.response.text}")
            break
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON response: {e}")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")
            break
    
    return all_articles_info

def main():
    """
    Main function to execute the bushfire news article fetching process.
    
    Configures search parameters, calls the fetch function, and saves results to JSON.
    """
    api_key = 'XXXXXXXXXXXXXXXXX' # API key omitted for security

    # Define search parameters
    start_date = "2019-12-01"
    end_date = "2019-12-05"
    # List of news sources to search
    urls = [
        "theguardian.com", "abc.net.au", "news.com.au", "heraldsun.com.au", "skynews.com.au",
        "afr.com", "smh.com.au", "dailytelegraph.com.au", "foxnews.com", "nytimes.com",
        "dailywire.com", "couriermail.com.au", "thewest.com.au", "7news.com.au", "9news.com.au",
        "theconversation.com", "nypost.com", "wsj.com", "wattsupwiththat.com", "breitbart.com",
        "newsmax.com", "naturalnews.com", "washingtontimes.com", "infowars.com"
    ]
    
    print("Fetching articles...")
    all_articles_info = fetch_bushfire_news(api_key, start_date, end_date, urls)
    
    # Save results to JSON file
    filename = "BushfireRelatedArticlesREQUEST1.json"
    try:
        with open(filename, 'w', encoding='utf-8') as json_file:
            json.dump(all_articles_info, json_file, indent=4, ensure_ascii=False)
        print(f"All articles saved to '{filename}'")
    except Exception as e:
        print(f"Error saving articles to JSON file: {e}")
    
    print(f"\nTotal articles collected: {len(all_articles_info)}")

if __name__ == "__main__":
    main()