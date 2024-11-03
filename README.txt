# VC402 The Zone - Climate Change Data Visualisation Project

"The Zone" is a data visualisation project that explores how climate change is discussed in the news and media and displays the complex relationship between data in a 3D interactive experience.

## Live Website
- Primary URL: https://aeonify.net/
- ALT Link: https://d2jl8ur9ogbn90.cloudfront.net/

## Features
- Search for news article data using optional parameters such as keywords, sources, publishers, think tank references and date ranges
- View and manage all retrieved news article data in a dashboard view
- Articles have been classified and tagged by Deep Learning LLM with identified broad and sub claims made by the article accompanied by corresponding sentences
- Apply different filters such as highlights, clustering and edges to visualise how individual data points are connected or disjointed
- View a summary of data and filters currently applied to the session

## How To Use

### Search For Data
1. Click the "accept terms and conditions" checkbox and click the "Enter The Zone" button to access the research tool site
2. Click "Search" on the presented search form to return all data or enter optional search parameters to refine search results
3. Review returned data in the "X articles loaded" button
4. Reduce the number of nodes/data points displayed with the slider control or by going into the table view option
5. Click "Generate visualisation" button when ready to view and interact with the data

### Interact With Data
- Zoom in/out or rotate the sphere. Holding the ctrl key or the right click mouse button allows you to pan around the environment 
- Click on an individual node to view more information about it via the info / detailed article panel

### Apply Filters
- On the side panel you can switch between the 3 main filter modes: Highlight, Cluster, Edges and selection your wanted visualisation options

## Installation & Setup

### Frontend
1. cd into "frontend" directory located in "The-Zone-Semester-2-WIL-Program-main > frontend"
2. Run "npm install" to install React project and dependencies
3. Run "npm start" to start local server

### Tests
1. Open 'selenium-test' folder in a Java IDE (e.g. IntelliJ)
2. Attach junit5 jar located in "JUniteExtension > Jars > JUnit_5_Extension_jar > JUnit5Extension.jar"
3. Attach selenium server jar located in "selenium-server4.24.0.jar"
4. Open TestSidePanel.java located in "src > test > java > TestSidePanel.java"
5. Run the TestSidePanel.java file
6. Observe the automated Chrome test browser run through the tests script
7. Review results

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

Private GitHub REPO: https://github.com/laurencewatts3/The-Zone-Semester-2-WIL-Program/tree/main

## Backend Details

### API Integration
- API endpoint: https://ynicn27cgg.execute-api.ap-southeast-2.amazonaws.com/prod?
- For more information on how it works please read the README located in the folder VC402-source/aws/lambda

### Cloud Information
- The website is already deployed on AWS cloud, which is owned by Laurence
- If you need to redeploy the cloud, crate a stack on cloud formation using the template lazone-infrastructure.yaml located in aws/cloud formation. NOTE: This may require you to configure a IAM Role for CloudFormation which a guide to how to do that can be found here: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html
- More information on cloud deployment can be found in the VC402-technical-report.pdf

## Release History

### v1.0.0 (Nov 3, 2024)
**Major release featuring complete frontend and backend integration**
- Full visualization system with 3D particle interactions
- Advanced filtering and search capabilities
- Complete API documentation
- Production-ready deployment configuration
- *Reviewed by: Christopher Partridge*

### v0.4.0 (Oct 24, 2024)
**Enhanced visualization features**
- Improved cluster formations and transitions
- New color highlighting system
- Advanced node interaction controls
- Updated UI/UX with smoother transitions
- *Reviewed by: Oisin Aeonn*

### v0.3.0 (Oct 10, 2024)
**Major visualization update**
- 3D space implementation
- Dynamic particle system
- Enhanced filtering capabilities
- Improved data processing
- *Reviewed by: Christopher Partridge*

### v0.2.0 (Sep 15, 2024)
**Core functionality implementation**
- Article particle system
- Basic visualization features
- Initial API integration
- *Reviewed by: Oisin Aeonn*

### v0.1.0 (Aug 9, 2024)
**Initial release**
- Basic project structure
- Frontend environment setup
- Initial backend services
- *Reviewed by: Jasica Sun-Sun Jong*

## Detailed Changelog

### November 2024
- Added comprehensive backend documentation
- Implemented full frontend visualization features
- Enhanced search functionality with multi-parameter support
- Optimized particle system performance
- *Reviewed by: Christopher Partridge*

### October 2024
- Implemented 3D visualization space
- Added advanced clustering algorithms
- Enhanced node interaction system
- Improved color management for visualizations
- Added multi-selection menus for claims and sources
- Implemented fullscreen functionality
- *Reviewed by: Oisin Aeonn*

### September 2024
- Developed article particle system
- Implemented basic visualization features
- Added disclaimer and home page components
- Created swarm visualization demo
- Enhanced data processing capabilities
- *Reviewed by: Lucas Phung*

### August 2024
- Set up React + TypeScript + Tailwind environment
- Implemented side panel controls
- Created article preview modal
- Added basic filtering functionality
- Implemented dark theme
- Created initial API endpoints
- *Reviewed by: Jermaine Portelli*
