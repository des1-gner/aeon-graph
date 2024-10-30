import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Article } from '../types/article';

const CACHED_ARTICLES_KEY = 'cached_articles';
const CACHED_HIGHLIGHT_COLOR_KEY = 'cached_highlight_color';
const CACHED_CLUSTER_COLOR_KEY = 'cached_cluster_color';
const CACHED_EDGE_COLOR_KEY = 'cached_edge_color';

// Type definitions
export type VisibilityType = 'on' | 'hover' | 'off';

interface ArticlesProviderProps {
    children: ReactNode;
}

interface CommonOptions {
    articleBody: string;
    broadClaim: string;
    subClaim: string;
    source: string;
    think_tank_ref: string;
    isDuplicate: string;
}

export interface EdgeOptions extends CommonOptions {
    visibility: VisibilityType;
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
    highlightOptions: CommonOptions;
    setHighlightOptions: React.Dispatch<React.SetStateAction<CommonOptions>>;
    clusterOptions: CommonOptions;
    setClusterOptions: React.Dispatch<React.SetStateAction<CommonOptions>>;
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

    // Default options
    const defaultOptions: CommonOptions = {
        articleBody: '',
        broadClaim: '',
        subClaim: '',
        source: '',
        think_tank_ref: 'no',
        isDuplicate: 'no',
    };

    const defaultEdgeOptions: EdgeOptions = {
        ...defaultOptions,
        visibility: 'off',
    };

    // State for options
    const [highlightOptions, setHighlightOptions] = useState<CommonOptions>(defaultOptions);
    const [clusterOptions, setClusterOptions] = useState<CommonOptions>(defaultOptions);
    const [edgeOptions, setEdgeOptions] = useState<EdgeOptions>(defaultEdgeOptions);

    // Load cached data on mount
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

    // Cache articles when they change
    useEffect(() => {
        if (articles) {
            localStorage.setItem(CACHED_ARTICLES_KEY, JSON.stringify(articles));
        }
    }, [articles]);

    // Cache colors when they change
    useEffect(() => {
        localStorage.setItem(CACHED_HIGHLIGHT_COLOR_KEY, highlightColor);
    }, [highlightColor]);

    useEffect(() => {
        localStorage.setItem(CACHED_CLUSTER_COLOR_KEY, clusterColor);
    }, [clusterColor]);

    useEffect(() => {
        localStorage.setItem(CACHED_EDGE_COLOR_KEY, edgeColor);
    }, [edgeColor]);

    // Article management functions
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