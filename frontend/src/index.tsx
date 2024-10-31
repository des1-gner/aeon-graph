// Import core React dependencies
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import global styles
import './index.css';

// Import the root App component
import App from './App';

// Import performance measurement function
import reportWebVitals from './reportWebVitals';

// Import context provider for managing article data state
import { ArticlesProvider } from './pages/graph/contexts/ArticlesContext';

// Import assets
import logo from 'frontend/zone.jpg'

// Create a root container for React to render into
// TypeScript notation ensures the element exists and is of correct type
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Render the application
reportWebVitals();
root.render(
  <React.StrictMode>
    <ArticlesProvider>
      <App />
    </ArticlesProvider>
  </React.StrictMode>
);