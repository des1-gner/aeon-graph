// Import the ReportHandler type from web-vitals library for performance metrics
import { ReportHandler } from 'web-vitals';

// Function to report Core Web Vitals metrics
const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  // Only run if callback is provided and is a valid function
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import web-vitals library for better performance
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Measure Cumulative Layout Shift (visual stability)
      getCLS(onPerfEntry);
      // Measure First Input Delay (interactivity)
      getFID(onPerfEntry);
      // Measure First Contentful Paint (loading performance)
      getFCP(onPerfEntry);
      // Measure Largest Contentful Paint (loading performance)
      getLCP(onPerfEntry);
      // Measure Time to First Byte (server response time)
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;