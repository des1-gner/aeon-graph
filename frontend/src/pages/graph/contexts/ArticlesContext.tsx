import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Article } from '../three.js/types/article';

// Constants for localStorage keys to cache application state
const CACHED_ARTICLES_KEY = 'cached_articles';
const CACHED_HIGHLIGHT_COLOR_KEY = 'cached_highlight_color';
const CACHED_CLUSTER_COLOR_KEY = 'cached_cluster_color';
const CACHED_EDGE_COLOR_KEY = 'cached_edge_color';

// Define visibility options for edge elements
export type VisibilityType = 'on' | 'hover' | 'off';

// Props interface for the ArticlesProvider component
interface ArticlesProviderProps {
    children: ReactNode;
}

// Common interface for options shared between highlight, cluster, and edge settings
interface CommonOptions {
    articleBody: string;      // Content of the article
    broadClaim: string;       // Main claim or thesis
    subClaim: string;        // Supporting or sub-claim
    source: string;          // Article source
    think_tank_ref: string;  // Reference to think tank (yes/no)
    isDuplicate: string;     // Duplicate status flag
}

// Extended interface for edge-specific options
export interface EdgeOptions extends CommonOptions {
    visibility: VisibilityType;  // Visibility state for edges
}

// Context interface defining all available properties and methods
interface ArticlesContextProps {
    articles: Article[] | undefined;                    // Collection of articles
    setArticles: (articles: Article[] | undefined) => void;  // Update articles
    deleteArticle: (article: Article) => void;         // Remove single article
    clearAllArticles: () => void;                      // Remove all articles
    highlightedWord: string | undefined;               // Currently highlighted word
    setHighlightedWord: (word: string | undefined) => void;  // Update highlighted word
    clearHighlightedWord: () => void;                  // Clear highlighted word
    highlightColor: string;                           // Color for highlights
    setHighlightColor: (color: string) => void;       // Update highlight color
    clusterColor: string;                             // Color for clusters
    setClusterColor: (color: string) => void;         // Update cluster color
    edgeColor: string;                                // Color for edges
    setEdgeColor: (color: string) => void;            // Update edge color
    highlightOptions: CommonOptions;                  // Highlight settings
    setHighlightOptions: React.Dispatch<React.SetStateAction<CommonOptions>>;
    clusterOptions: CommonOptions;                    // Cluster settings
    setClusterOptions: React.Dispatch<React.SetStateAction<CommonOptions>>;
    edgeOptions: EdgeOptions;                         // Edge settings
    setEdgeOptions: React.Dispatch<React.SetStateAction<EdgeOptions>>;
}

// Create the context with a default empty object
const ArticlesContext = createContext<ArticlesContextProps>({} as ArticlesContextProps);

/**
 * ArticlesProvider component that manages the global state for articles and their visualization options
 * Handles caching of data in localStorage and provides methods for state management
 */
export const ArticlesProvider: React.FC<ArticlesProviderProps> = ({ children }) => {
    // State for articles and highlighting
    const [articles, setArticles] = useState<Article[] | undefined>();
    const [highlightedWord, setHighlightedWord] = useState<string | undefined>();
    
    // State for various color settings
    const [highlightColor, setHighlightColor] = useState('#FFFFFF');
    const [clusterColor, setClusterColor] = useState('#FFFFFF');
    const [edgeColor, setEdgeColor] = useState('#FFFFFF');

    // Default options for various features
    const defaultOptions: CommonOptions = {
        articleBody: '',
        broadClaim: '',
        subClaim: '',
        source: '',
        think_tank_ref: 'no',
        isDuplicate: 'no',
    };

    // Extended default options for edges
    const defaultEdgeOptions: EdgeOptions = {
        ...defaultOptions,
        visibility: 'off',
    };

    // State for feature-specific options
    const [highlightOptions, setHighlightOptions] = useState<CommonOptions>(defaultOptions);
    const [clusterOptions, setClusterOptions] = useState<CommonOptions>(defaultOptions);
    const [edgeOptions, setEdgeOptions] = useState<EdgeOptions>(defaultEdgeOptions);

    // Load cached data from localStorage on component mount
    useEffect(() => {
        // Load articles
        const cachedArticles = localStorage.getItem(CACHED_ARTICLES_KEY);
        if (cachedArticles) {
            setArticles(JSON.parse(cachedArticles));
        }
        
        // Load color settings
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

    // Cache articles whenever they change
    useEffect(() => {
        if (articles) {
            localStorage.setItem(CACHED_ARTICLES_KEY, JSON.stringify(articles));
        }
    }, [articles]);

    // Cache colors whenever they change
    useEffect(() => {
        localStorage.setItem(CACHED_HIGHLIGHT_COLOR_KEY, highlightColor);
    }, [highlightColor]);

    useEffect(() => {
        localStorage.setItem(CACHED_CLUSTER_COLOR_KEY, clusterColor);
    }, [clusterColor]);

    useEffect(() => {
        localStorage.setItem(CACHED_EDGE_COLOR_KEY, edgeColor);
    }, [edgeColor]);

    /**
     * Removes a specific article from the collection
     * @param articleToDelete The article to be removed
     */
    const deleteArticle = (articleToDelete: Article) => {
        if (articles) {
            const updatedArticles = articles.filter(
                (article) => article.uri !== articleToDelete.uri
            );
            setArticles(updatedArticles);
        }
    };

    /**
     * Clears all articles from state and localStorage
     */
    const clearAllArticles = () => {
        localStorage.removeItem(CACHED_ARTICLES_KEY);
        setArticles(undefined);
    };

    /**
     * Clears the currently highlighted word
     */
    const clearHighlightedWord = () => {
        setHighlightedWord(undefined);
    };

    // Provide the context value to children components
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

// Custom hook to use the articles context
export const useArticles = () => useContext(ArticlesContext);