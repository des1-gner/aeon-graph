<h1>The Zone API Documentation</h1>

<h2>Endpoint</h2>

-GET https://ynicn27cgg.execute-api.ap-southeast-2.amazonaws.com/prod

<h3>Parameters</h3>

If no parameters are provided, then random articles are returned. The max amount of articles returned with or without parameters is 128. This can be adjusted by changing the MAX_ITEMS variable in the lazone lambda function. Warning! Higher cost will incur the more items retrieved.

startDate (optional)
<ul>
<li>Type: string </li>
<li>Format: ISO 8601 (e.g., 2024-01-20T00:00:00Z)</li>
<li>Description: Retrieves articles that are greater than or equal to the provided date.</li>
<li>Example: ?startDate=2019-02-01T00:00:00Z</li>
<li>Note: Can be used with the endDate parameter to search between dates.</li>
</ul>

EndDate (optional)
<ul>
<li>Type: string</li>
<li>Format: ISO 8601 (e.g., 2024-01-20T00:00:00Z)</li>
<li>Description: Retrieves articles that are less than or equal to the provided date.</li>
<li>Example: ?endDate=2020-03-01T00:00:00Z</li>
<li>Note: Can be used with startDate parameter to search between dates.</li>
</ul>
search (optional)
<ul>
<li>Type: string
<li>Description: Retrieves articles containing this search term in the article body.</li>
<li>Example1: ?search=arson (retrieve articles that contain the word arson in its body)</li>
<li>Example2: ?search=climate+change (retrieve articles that contain climate change in its body)</li>
</ul>
sources (optional)
<ul>
<li>Type: string</li>
<li>Description: Retrieves articles from specified sources.</li>
<li>Example 1: ?sources=foxnews.com (retrieve articles from fox news)</li>
<li>Example 2: ?sources=foxnews.com,nypost.com (retrieve articles from fox news and nypost)</li>
</li>Note: multiple sources are comma separated and sources cannot be used with publisher parameter.</li>
</ul>
publisher (optional)
<ul>
<li>Type: string
<li>Description: Retrieves articles from a specific publisher (e.g., murdoch media)</li>
<li>Example: ?publisher=murdoch+media ( retrieve articles that belong to murdoch media)</li>
<li>Note: A list of publishers, and associated websites that belong to them, can be found in the publisher section of this document. This cannot be used with the sources parameter</li>
</ul>
thinkTankRef (optional)
<ul>
<li>Type: String</li>
<li>Description: Retrieves articles that contain a think tank reference.</li>
<li>Example: ?thinkTankRef=true</li>
</ul>

<h3>Publishers</h3>

Murdoch Media : returns [
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



