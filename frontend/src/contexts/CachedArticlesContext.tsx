import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import { NewsArticle } from '../types/news-article';

const CACHED_ARTICLES_KEY = 'cached_articles';

interface CachedArticlesProviderProps {
    children: ReactNode;
}

interface CachedArticlesContextProps {
    cachedArticles: NewsArticle[] | undefined;
    saveArticlesToCache: (articles: NewsArticle[]) => void;
    deleteCachedArticle: (article: NewsArticle) => void;
    clearCachedArticles: () => void;
}

const CachedArticleContext = createContext({} as CachedArticlesContextProps);

export const CachedArticleProvider = ({
    children,
}: CachedArticlesProviderProps) => {
    const [cachedArticles, setCachedArticles] = useState<NewsArticle[]>();

    const getCachedArticles = (): NewsArticle[] | undefined => {
        const cachedArticles = localStorage.getItem(CACHED_ARTICLES_KEY);
        return cachedArticles ? JSON.parse(cachedArticles) : undefined;
    };

    const saveArticlesToCache = (articles: NewsArticle[]) => {
        if (articles.length > 0) {
            setCachedArticles(articles);
            localStorage.setItem(CACHED_ARTICLES_KEY, JSON.stringify(articles));
        }
    };

    const deleteCachedArticle = (articleToDelete: NewsArticle) => {};

    const clearCachedArticles = () => {
        setCachedArticles(undefined);
        localStorage.removeItem(CACHED_ARTICLES_KEY);
    };

    useEffect(() => {
        setCachedArticles(getCachedArticles());
    }, []);

    useEffect(() => {
        console.log('CACHED CONTEXT', cachedArticles);
    }, [cachedArticles]);

    return (
        <CachedArticleContext.Provider
            value={{
                cachedArticles,
                saveArticlesToCache,
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
