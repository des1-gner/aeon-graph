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

type ArticlesContextProps = {
    articles: Article[] | undefined;
    setArticles: (articles: Article[] | undefined) => void;
    deleteArticle: (article: Article) => void;
    clearAllArticles: () => void;
    highlightedWord: string | undefined;
    setHighlightedWord: (word: string | undefined) => void;
    clearHighlightedWord: () => void;
};

const ArticleContext = createContext({} as ArticlesContextProps);

export const ArticleProvider = ({ children }: ArticlesProviderProps) => {
    const [articles, setArticles] = useState<Article[] | undefined>();
    const [highlightedWord, setHighlightedWord] = useState<
        string | undefined
    >();

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
                (article) => article.uri !== articleToDelete.uri
            );
            setArticles(updatedArticles);
        }
    };

    const clearAllArticles = () => {
        localStorage.removeItem(CACHED_ARTICLES_KEY);
        setArticles(undefined);
    };

    const clearHighlightedWord = () => {
        setHighlightedWord(undefined);
    };

    return (
        <ArticleContext.Provider
            value={{
                articles,
                setArticles,
                deleteArticle,
                clearAllArticles,
                highlightedWord,
                setHighlightedWord,
                clearHighlightedWord,
            }}
        >
            {children}
        </ArticleContext.Provider>
    );
};

export const useArticles = () => {
    return useContext(ArticleContext);
};
