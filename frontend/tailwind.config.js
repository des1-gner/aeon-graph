/** 
* @type {import('tailwindcss').Config} 
* TypeScript type annotation for Tailwind CSS configuration
*/
module.exports = {
    // Specify files to scan for class names
    content: [
      './src/**/*.{js,jsx,ts,tsx}' // Scan all JS, JSX, TS, TSX files in src directory
    ],
    theme: {
      extend: {
        // Empty object to extend default Tailwind theme
        // Add custom colors, spacing, etc. here
      },
    },
    plugins: [], // Array for Tailwind plugins
   };