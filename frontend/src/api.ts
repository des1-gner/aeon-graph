import axios from 'axios';

export const fetchArticle = async (
    search?: string,
    startDate?: string,
    endDate?: string,
    sources?: string[],
    publisher?: string,
    thinkTankRef?: Boolean
) => {
    const params = {
        search: search?.toLocaleLowerCase(),
        startDate: startDate,
        endDate: endDate,
        sources: sources?.join(','),
        publisher: publisher?.toLocaleLowerCase(),
        thinkTankRef: thinkTankRef,
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
