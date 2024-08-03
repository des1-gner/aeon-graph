import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify, request
from flask_cors import CORS
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes from any origin

# Create a session with retry logic
session = requests.Session()
retry = Retry(
    total=5,  # Total number of retries
    backoff_factor=0.3,  # Backoff factor for retries
    status_forcelist=[500, 502, 503, 504],  # Retry on these status codes
    allowed_methods=["GET"]  # Retry for GET requests
)
adapter = HTTPAdapter(max_retries=retry)
session.mount("https://", adapter)
session.mount("http://", adapter)

# Define a common User-Agent header
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
}

# List of URLs to skip
skip_urls = [
    "https://removed.com"
]

def is_valid_url(url):
    parsed_url = urlparse(url)
    return bool(parsed_url.scheme) and bool(parsed_url.netloc)

# Function to get all links within paragraph tags from a given URL
def get_paragraph_links(url):
    if url in skip_urls:
        print(f"Skipping URL: {url}")
        return []  # Return an empty list if the URL should be skipped
    if not is_valid_url(url):
        print(f"Invalid URL: {url}")
        return []  # Return an empty list if the URL is not valid
    try:
        response = session.get(url, headers=headers, timeout=10)  # Set a timeout for the request
        response.raise_for_status()  # Raise an exception for HTTP errors
        if 'text/html' not in response.headers.get('Content-Type', ''):
            print(f"Non-HTML content for URL: {url}")
            return []  # Return an empty list for non-HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        links = []
        for p_tag in soup.find_all('p'):
            for a_tag in p_tag.find_all('a', href=True):
                links.append(a_tag['href'])
        return links
    except requests.exceptions.HTTPError as e:
        if e.response.status_code in [401, 403]:
            skip_urls.append(url)  # Dynamically add URL to skip list if it returns a 401 or 403 error
            print(f"Skipping URL due to {e.response.status_code} error: {url}")
            return []  # Return an empty list for 401 or 403 errors
        raise  # Re-raise the exception for other HTTP errors
    except requests.exceptions.RequestException as e:
        print(f"Error fetching paragraph links for URL {url}: {e}")
        return []  # Return an empty list for other request exceptions

# Function to get the title of the webpage from a given URL
def get_article_title(url):
    if url in skip_urls:
        print(f"Skipping URL: {url}")
        return None  # Return None if the URL should be skipped
    if not is_valid_url(url):
        print(f"Invalid URL: {url}")
        return None  # Return None if the URL is not valid
    try:
        response = session.get(url, headers=headers, timeout=10)  # Set a timeout for the request
        response.raise_for_status()  # Raise an exception for HTTP errors
        if 'text/html' not in response.headers.get('Content-Type', ''):
            print(f"Non-HTML content for URL: {url}")
            return None  # Return None for non-HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        title_tag = soup.find('title')
        if title_tag:
            return title_tag.string.strip()
        else:
            return None
    except requests.exceptions.HTTPError as e:
        if e.response.status_code in [401, 403]:
            skip_urls.append(url)  # Dynamically add URL to skip list if it returns a 401 or 403 error
            print(f"Skipping URL due to {e.response.status_code} error: {url}")
            return None  # Return None for 401 or 403 errors
        print(f"Error fetching title for URL {url}: {e}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error fetching title for URL {url}: {e}")
        return None  # Return None for other request exceptions

@app.route('/api/paragraph-links', methods=['GET'])
def fetch_paragraph_links():
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL parameter is required'}), 400

    try:
        print(f"Fetching paragraph links for URL: {url}")
        links = get_paragraph_links(url)
        return jsonify({'links': links})
    except requests.exceptions.RequestException as e:
        print(f"Error fetching paragraph links for URL {url}: {e}")  # Improved logging
        return jsonify({'error': str(e)}), 500

@app.route('/api/article-title', methods=['GET'])
def fetch_article_title():
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL parameter is required'}), 400

    try:
        print(f"Fetching article title for URL: {url}")  # Log the URL received
        title = get_article_title(url)
        return jsonify({'title': title})
    except requests.exceptions.RequestException as e:
        print(f"Error fetching title for URL {url}: {e}")  # Improved logging
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
