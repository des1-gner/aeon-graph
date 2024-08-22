import axios from 'axios';

export const getArticles = async (startDate: string, endDate: string) => {
    const params = {
        queryStringParameters: {
            startDate: '2024-08-10T00:00:00Z',
            endDate: '2024-08-23T23:59:59Z',
        },
    };
    return axios
        .get(
            'https://wr2lb9oak8.execute-api.ap-southeast-2.amazonaws.com/prod',
            { params }
        )
        .then((res) => res.data)
        .catch((error) => {
            console.error('Error fetching articles:', error);
            throw error;
        });
};

export const getNews = async (
    query: string,
    fromDate: string,
    toDate: string = new Date().toISOString()
) => {
    const url = `https://newsapi.org/v2/everything?q=${query}&from=${fromDate}&language=en&apiKey=${process.env.REACT_APP_NEWS_API}`;

    return axios
        .get(url)
        .then((res) => res.data)
        .catch((error) => {
            console.log('Error fetching new api articles', error);
            throw error;
        });
};
