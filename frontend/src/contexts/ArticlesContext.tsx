import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Article } from '../types/article';

const CACHED_ARTICLES_KEY = 'cached_articles';
const CACHED_HIGHLIGHT_COLOR_KEY = 'cached_highlight_color';
const CACHED_CLUSTER_COLOR_KEY = 'cached_cluster_color';
const CACHED_EDGE_COLOR_KEY = 'cached_edge_color';

interface ArticlesProviderProps {
    children: ReactNode;
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
    selectedBroadClaim: string;
    setSelectedBroadClaim: (claim: string) => void;
    selectedSubClaim: string;
    setSelectedSubClaim: (claim: string) => void;
    selectedSource: string;
    setSelectedSource: (source: string) => void;
    hasThinktankReference: string;
    setHasThinktankReference: (value: string) => void;
    isDuplicate: string;
    setIsDuplicate: (value: string) => void;
}

const ArticlesContext = createContext<ArticlesContextProps>({} as ArticlesContextProps);

export const ArticlesProvider: React.FC<ArticlesProviderProps> = ({ children }) => {
    const [articles, setArticles] = useState<Article[] | undefined>();
    const [highlightedWord, setHighlightedWord] = useState<string | undefined>();
    const [highlightColor, setHighlightColor] = useState('#FFFFFF');
    const [clusterColor, setClusterColor] = useState('#FFFFFF');
    const [edgeColor, setEdgeColor] = useState('#FFFFFF');
    const [selectedBroadClaim, setSelectedBroadClaim] = useState('');
    const [selectedSubClaim, setSelectedSubClaim] = useState('');
    const [selectedSource, setSelectedSource] = useState('');
    const [hasThinktankReference, setHasThinktankReference] = useState('');
    const [isDuplicate, setIsDuplicate] = useState('');

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
                selectedBroadClaim,
                setSelectedBroadClaim,
                selectedSubClaim,
                setSelectedSubClaim,
                selectedSource,
                setSelectedSource,
                hasThinktankReference,
                setHasThinktankReference,
                isDuplicate,
                setIsDuplicate,
            }}
        >
            {children}
        </ArticlesContext.Provider>
    );
};

export const useArticles = () => useContext(ArticlesContext);