import axios from 'axios';

/**
 * Fetches articles based on provided search criteria from the API
 * 
 * @param search - Optional search term to filter articles (will be converted to lowercase)
 * @param startDate - Optional start date for article publication range
 * @param endDate - Optional end date for article publication range
 * @param sources - Optional array of source names to filter articles
 * @param publisher - Optional publisher name to filter articles (will be converted to lowercase)
 * @param thinkTankRef - Optional boolean to filter articles with think tank references
 * 
 * @returns Promise that resolves to the API response data
 * @throws Will throw an error if the API request fails
 */
export const fetchArticle = async (
    search?: string,
    startDate?: string,
    endDate?: string,
    sources?: string[],
    publisher?: string,
    thinkTankRef?: Boolean
) => {
    // Construct query parameters object with optional filters
    const params = {
        search: search?.toLocaleLowerCase(),        // Convert search term to lowercase
        startDate: startDate,                       // Start date filter
        endDate: endDate,                          // End date filter
        sources: sources?.join(','),               // Convert sources array to comma-separated string
        publisher: publisher?.toLocaleLowerCase(),  // Convert publisher to lowercase
        thinkTankRef: thinkTankRef,                // Think tank reference filter
    };

    // Make GET request to the API endpoint with constructed parameters
    return axios
        .get(
            'https://ynicn27cgg.execute-api.ap-southeast-2.amazonaws.com/prod',
            { params }
        )
        .then((res) => res.data)                   // Extract data from successful response
        .catch((error) => {
            console.error('Error fetching articles:', error);  // Log any errors
            throw error;                           // Re-throw error for handling by caller
        });
};