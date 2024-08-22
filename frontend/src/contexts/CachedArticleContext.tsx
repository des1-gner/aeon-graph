import { createContext, ReactNode, useContext, useState } from 'react';
import { NewsArticle } from '../types/news-article';

const CACHED_ARTICLES_KEY = 'cached_articles';

interface CachedArticleProviderProps {
    children: ReactNode;
}

interface CachedArticleContextProps {
    cachedArticles: NewsArticle[] | undefined;
    cacheArticles: (articles: NewsArticle[]) => void;
    deleteCachedArticle: (article: NewsArticle) => void;
    clearCachedArticles: () => void;
}

const CachedArticleContext = createContext({} as CachedArticleContextProps);

export const CachedArticleProvider = ({
    children,
}: CachedArticleProviderProps) => {
    const [cachedArticles, setCachedArticles] = useState<NewsArticle[]>();

    const cacheArticles = (articles: NewsArticle[]) => {
        setCachedArticles(articles);
        if (articles) {
            localStorage.setItem(CACHED_ARTICLES_KEY, JSON.stringify(articles));
        }
    };

    const deleteCachedArticle = (articleToDelete: NewsArticle) => {};

    const clearCachedArticles = () => {
        setCachedArticles(undefined);
        localStorage.removeItem(CACHED_ARTICLES_KEY);
    };

    return (
        <CachedArticleContext.Provider
            value={{
                cachedArticles,
                cacheArticles,
                clearCachedArticles,
                deleteCachedArticle,
            }}
        >
            {children}
        </CachedArticleContext.Provider>
    );
};

export const useCachedArticles = () => {
    return useContext(CachedArticleContext);
};
