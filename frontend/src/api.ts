import axios from 'axios';

export const fetchArticle = async (
    search?: string,
    startDate?: string,
    endDate?: string
) => {
    const params = {
        search: search,
        startDate: startDate,
        endDate: endDate,
    };
    return axios
        .get(
            'https://ynicn27cgg.execute-api.ap-southeast-2.amazonaws.com/prod',
            { params }
        )
        .then((res) => res.data)
        .catch((error) => {
            console.error('Error fetching articles:', error);
            throw error;
        });
};

// export const searchArticleByQuery = async (search: string) => {
//     const params = {
//         search,
//     };
//     return axios
//         .get(
//             'https://ynicn27cgg.execute-api.ap-southeast-2.amazonaws.com/prod',
//             { params }
//         )
//         .then((res) => res.data)
//         .catch((error) => {
//             console.error('Error fetching articles:', error);
//             throw error;
//         });
// };
