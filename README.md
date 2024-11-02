# The Zone - Climate Change Data Visualisation Project

"The Zone" is a data visualisation project that explores how climate change is discussed in the news and media and displays the complex relationship between data in a 3D interactive experience.

## Live Website
https://aeonify.net/

## Features
- Search for news article data using optional parameters such as keywords, sources, publishers, think tank references and date ranges
- View and manage all retrieved news article data in a dashboard view
- Articles have been classified and tagged by AI with identified broad and sub claims made by the article
- Apply different filters such as highlights, clustering and edges to visualise how individual data points are connected
- View a summary of data and filters currently applied to the session
  
## How To Use
### Search For Data
- Click the "accept terms and conditions" checkbox and click the "Enter The Zone" button to access the website
- Click "Search" on the presented search form to return all data or enter optional search parameters to refine search results
- Review returned data in the "x articles loaded" button
- Reduce the number of nodes/data points displayed with the slider control
- Click "Generate visualisation" button when ready to view and interact with the data

### Interact With Data
- Zoom in/out or rotate the sphere. Holding ctrl key allows you to pan around the environment 
- Click on an indidivudal node to view more information about it

### Apply Filters
- On the side panel you can switch between the 3 main filter modes. Highlight, Cluster, Edges

## Local Installation
### Frontend
1. cd into "frontend" directory located in "The-Zone-Semester-2-WIL-Program-main > frontend"
2. Run "npm install" to install React project and dependencies
3. Run "npm start" to start local server
   
### Backend

### Tests
1. Open 'selenium-test' folder in a Java IDE (e.g. IntelliJ)
2. Attach junit5 jar located in "JUniteExtension > Jars > JUnit_5_Extension_jar > JUnit5Extension.jar"
3. Attach selenium server jar located in "selenium-server4.24.0.jar"
4. Open TestSidePanel.java located in "src > test > java > TestSidePanel.java"
5. Run the TestSidePanel.java file
6. Observe the automated Chrome test browser run through the tests script
7. Review results
   
### Deployment

## Tech Stack
### Frontend
- React
- Typescript
- Tailwindcss

### Backend
- AWS Lambda
- DynamoDb
- Python

### Testing
- Selenium
- Java

## Development Team
- Oisin Aeonn
- Jasica Jong
- Chris Partridge
- Lucas Phung
- Jermaine Portelli
- Laurence Watts
