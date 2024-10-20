import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Article } from '../types/article';

const CACHED_ARTICLES_KEY = 'cached_articles';
const CACHED_HIGHLIGHT_COLOR_KEY = 'cached_highlight_color';
const CACHED_CLUSTER_COLOR_KEY = 'cached_cluster_color';
const CACHED_EDGE_COLOR_KEY = 'cached_edge_color';

interface ArticlesProviderProps {
    children: ReactNode;
}

interface FilterOptions {
    broadClaim: string;
    subClaim: string;
    source: string;
    think_tank_ref: string;
    isDuplicate: string;
}

interface HighlightOptions extends FilterOptions {
    articleBody: string;
}

interface EdgeOptions extends FilterOptions {
    visibility: string;
}

interface ArticlesContextProps {
    articles: Article[] | undefined;
    setArticles: (articles: Article[] | undefined) => void;
    deleteArticle: (article: Article) => void;
    clearAllArticles: () => void;
    highlightedWord: string | undefined;
    setHighlightedWord: (word: string | undefined) => void;
    clearHighlightedWord: () => void;
    highlightColor: string;
    setHighlightColor: (color: string) => void;
    clusterColor: string;
    setClusterColor: (color: string) => void;
    edgeColor: string;
    setEdgeColor: (color: string) => void;
    highlightOptions: HighlightOptions;
    setHighlightOptions: React.Dispatch<React.SetStateAction<HighlightOptions>>;
    clusterOptions: FilterOptions;
    setClusterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
    edgeOptions: EdgeOptions;
    setEdgeOptions: React.Dispatch<React.SetStateAction<EdgeOptions>>;
}

const ArticlesContext = createContext<ArticlesContextProps>({} as ArticlesContextProps);

export const ArticlesProvider: React.FC<ArticlesProviderProps> = ({ children }) => {
    const [articles, setArticles] = useState<Article[] | undefined>();
    const [highlightedWord, setHighlightedWord] = useState<string | undefined>();
    const [highlightColor, setHighlightColor] = useState('#FFFFFF');
    const [clusterColor, setClusterColor] = useState('#FFFFFF');
    const [edgeColor, setEdgeColor] = useState('#FFFFFF');
    const [highlightOptions, setHighlightOptions] = useState<HighlightOptions>({
        broadClaim: '',
        subClaim: '',
        source: '',
        think_tank_ref: '',
        isDuplicate: '',
        articleBody: '',
    });
    const [clusterOptions, setClusterOptions] = useState<FilterOptions>({
        broadClaim: '',
        subClaim: '',
        source: '',
        think_tank_ref: '',
        isDuplicate: '',
    });
    const [edgeOptions, setEdgeOptions] = useState<EdgeOptions>({
        broadClaim: '',
        subClaim: '',
        source: '',
        think_tank_ref: '',
        isDuplicate: '',
        visibility: 'off',
    });

    useEffect(() => {
        const cachedArticles = localStorage.getItem(CACHED_ARTICLES_KEY);
        if (cachedArticles) {
            setArticles(JSON.parse(cachedArticles));
        }
        const cachedHighlightColor = localStorage.getItem(CACHED_HIGHLIGHT_COLOR_KEY);
        if (cachedHighlightColor) {
            setHighlightColor(cachedHighlightColor);
        }
        const cachedClusterColor = localStorage.getItem(CACHED_CLUSTER_COLOR_KEY);
        if (cachedClusterColor) {
            setClusterColor(cachedClusterColor);
        }
        const cachedEdgeColor = localStorage.getItem(CACHED_EDGE_COLOR_KEY);
        if (cachedEdgeColor) {
            setEdgeColor(cachedEdgeColor);
        }
    }, []);

    useEffect(() => {
        if (articles) {
            localStorage.setItem(CACHED_ARTICLES_KEY, JSON.stringify(articles));
        }
    }, [articles]);

    useEffect(() => {
        localStorage.setItem(CACHED_HIGHLIGHT_COLOR_KEY, highlightColor);
    }, [highlightColor]);

    useEffect(() => {
        localStorage.setItem(CACHED_CLUSTER_COLOR_KEY, clusterColor);
    }, [clusterColor]);

    useEffect(() => {
        localStorage.setItem(CACHED_EDGE_COLOR_KEY, edgeColor);
    }, [edgeColor]);

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
        <ArticlesContext.Provider
            value={{
                articles,
                setArticles,
                deleteArticle,
                clearAllArticles,
                highlightedWord,
                setHighlightedWord,
                clearHighlightedWord,
                highlightColor,
                setHighlightColor,
                clusterColor,
                setClusterColor,
                edgeColor,
                setEdgeColor,
                highlightOptions,
                setHighlightOptions,
                clusterOptions,
                setClusterOptions,
                edgeOptions,
                setEdgeOptions,
            }}
        >
            {children}
        </ArticlesContext.Provider>
    );
};

export const useArticles = () => useContext(ArticlesContext);