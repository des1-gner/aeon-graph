import axios from 'axios';

// export const getArticles = async () => {
//     return axios
//         .get(
//             'https://wr2lb9oak8.execute-api.ap-southeast-2.amazonaws.com/prod',
//             {
//                 startDate: '2024-05-21T00:00:00Z',
//                 endDate: '2024-05-23T23:59:59Z',
//             }
//         )
//         .then((res) => res.data)
//         .catch((error) => {
//             console.error('Error fetching articles:', error);
//             throw error;
//         });
// };

export const getNews = async (
    query: string,
    fromDate: string,
    toDate: string = new Date().toISOString()
) => {
    const url = `https://newsapi.org/v2/everything?q=${query}&from=${fromDate}&language=en&apiKey=${process.env.REACT_APP_NEWS_API}`;
    try {
        const response = axios.get(url);
        return (await response).data;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
};
