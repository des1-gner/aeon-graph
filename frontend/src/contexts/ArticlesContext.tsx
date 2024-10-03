import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

import { Article } from '../types/article';

const CACHED_ARTICLES_KEY = 'cached_articles';

interface ArticlesProviderProps {
    children: ReactNode;
}

interface ArticlesContextProps {
    articles: Article[] | undefined;
    setArticles: (articles: Article[] | undefined) => void;
    deleteArticle: (article: Article) => void;
    clearAllArticles: () => void;
}

const ArticleContext = createContext({} as ArticlesContextProps);

export const ArticleProvider = ({ children }: ArticlesProviderProps) => {
    const [articles, setArticles] = useState<Article[] | undefined>();

    useEffect(() => {
        const cachedArticles = localStorage.getItem(CACHED_ARTICLES_KEY);
        if (cachedArticles) {
            setArticles(JSON.parse(cachedArticles));
        }
    }, []);

    useEffect(() => {
        if (articles) {
            localStorage.setItem(CACHED_ARTICLES_KEY, JSON.stringify(articles));
        }
    }, [articles]);

    const deleteArticle = (articleToDelete: Article) => {
        if (articles) {
            const updatedArticles = articles.filter(
                (article) => article.title !== articleToDelete.title
            );
            setArticles(updatedArticles);
        }
    };

    const clearAllArticles = () => {
        localStorage.removeItem(CACHED_ARTICLES_KEY);
        setArticles(undefined);
    };

    return (
        <ArticleContext.Provider
            value={{
                articles,
                setArticles,
                deleteArticle,
                clearAllArticles,
            }}
        >
            {children}
        </ArticleContext.Provider>
    );
};

export const useArticles = () => {
    return useContext(ArticleContext);
};
