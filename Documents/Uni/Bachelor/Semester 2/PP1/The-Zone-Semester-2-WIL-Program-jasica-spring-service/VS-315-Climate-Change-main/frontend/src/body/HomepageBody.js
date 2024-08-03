import React, { useState, useEffect } from "react";
import axios from "axios";
import articlesData from "../data/articles.json"; // Import the JSON file with article data
import AnimatedText from './AnimatedText';

const CONCURRENT_REQUESTS_LIMIT = 5; // Limit the number of concurrent requests

function Homepage() {
    const [combinedTexts, setCombinedTexts] = useState([]);
    const [initialTitles, setInitialTitles] = useState([]);
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);

    const [articles, setArticles] = useState([]);
    const [displayedArticles, setDisplayedArticles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const API_KEY = "5db6e8dab19a44e6a6a9ba79a2283e02";
    const API_URL = `https://newsapi.org/v2/everything?q=global+warming|climate+change&from=2024-05-15&sortBy=publishedAt&apiKey=${API_KEY}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from the News API
                const response = await axios.get(API_URL);
                const fetchedArticles = response.data.articles;

                // Sort articles by publishedAt in descending order
                fetchedArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

                setArticles(fetchedArticles);

                // Save data to the server
                await saveDataToServer(fetchedArticles);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        // Refresh data every minute
        const interval = setInterval(fetchData, 60000);

        return () => clearInterval(interval);
    }, []);

    // Saving the data to JSON file
    const saveDataToServer = async (data) => {
        try {
            await axios.post('http://localhost:8080/v1/save-articles', data);
        } catch (error) {
            console.error('Error saving data to server:', error);
        }
    };

    useEffect(() => {
        const processArticles = async () => {
            try {
                const initialTitles = articlesData.map(article => ({
                    text: article.title,
                    url: article.url, // Save the article URL from the JSON file
                    color: '#7be9fd' // Light Blue for original articles
                }));

                setInitialTitles(initialTitles);

                let combinedTitles = [...initialTitles];
                const newConnections = [];

                const processBatch = async (batch) => {
                    try {
                        // Fetch paragraph links for each article in the batch
                        const paragraphLinksPromises = batch.map(article =>
                            axios.get(`http://localhost:5000/api/paragraph-links?url=${encodeURIComponent(article.url)}`)
                        );
                        const paragraphLinksResponses = await Promise.all(paragraphLinksPromises);
                        const allParagraphLinks = paragraphLinksResponses.map(res => res.data.links);

                        // Fetch related article titles for the valid links
                        const validLinks = allParagraphLinks.flat().filter(link => link); // Filter out empty links
                        const articleTitlePromises = validLinks.map(link =>
                            axios.get(`http://localhost:5000/api/article-title?url=${encodeURIComponent(link)}`).catch(error => {
                                console.error(`Error fetching title for URL ${link}:`, error);
                                return null; // Return null if there's an error
                            })
                        );
                        const articleTitleResponses = await Promise.all(articleTitlePromises);
                        const allArticleTitles = articleTitleResponses
                            .filter(res => res && res.data.title) // Filter out null responses
                            .map(res => res.data.title);

                        // Combine titles and create connections
                        batch.forEach((article, articleIndex) => {
                            const relatedLinks = allParagraphLinks[articleIndex];
                            relatedLinks.forEach((link, linkIndex) => {
                                const relatedTitle = allArticleTitles[linkIndex];
                                if (relatedTitle) {
                                    // Avoid duplicate titles
                                    if (!combinedTitles.some(t => t.text === relatedTitle)) {
                                        combinedTitles.push({ text: relatedTitle, color: '#999999' }); // Grey for linked articles
                                    }
                                    newConnections.push({
                                        source: article.title,
                                        target: relatedTitle
                                    });
                                }
                            });
                        });
                    } catch (error) {
                        console.error('Error processing batch:', error);
                    }
                };

                // Process articles in batches to manage concurrency
                for (let i = 0; i < articlesData.length; i += CONCURRENT_REQUESTS_LIMIT) {
                    const batch = articlesData.slice(i, i + CONCURRENT_REQUESTS_LIMIT);
                    await processBatch(batch); // Wait for the batch to finish before starting the next
                }

                // Randomly select 50-100 titles
                const randomSubset = getRandomSubset(combinedTitles, 50, 100);

                setCombinedTexts(randomSubset);
                setConnections(newConnections);
                setLoading(false);  // Set loading to false after all data is fetched
            } catch (error) {
                console.error('Error processing articles:', error);
                setLoading(false);  // Set loading to false even if there's an error
            }
        };

        processArticles();
    }, []);

    // Function to get a random subset of titles
    const getRandomSubset = (array, min, max) => {
        const subsetSize = Math.floor(Math.random() * (max - min + 1)) + min;
        const shuffled = array.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, subsetSize);
    };

    if (loading) {
        return <div>Loading...</div>;  // Render a loading indicator while data is being fetched
    }

    return (
        <div>
            <h1>Global Warming and Climate Change Articles</h1>
            <AnimatedText initialTexts={initialTitles} texts={combinedTexts} connections={connections} />

            <ul>
                {articlesData.map((article, index) => (
                    <li key={index}>
                        <h2>{article.title}</h2>
                        <p>{article.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Homepage;
