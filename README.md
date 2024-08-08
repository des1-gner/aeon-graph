<h1>The Zone by Laurence Watts</h1>
<p>The Zone is a data visualisation project developed by Laurence Watts in collaboration with RMIT computer and data science students and consultation from Ben Hoskens, Founder of Flink Labs, Melbourne. It visualises the flow of news stories published online about climate change, growing and evolving over time to create a dynamic representation of the pace of contemporary news and information cultures. </p>

<h2>Technical Implementation</h2>

The technical implementation of the project is a React app which communicates with spring boot. The spring boot app handles the data from external API's. The reason we kept the Spring Boot application are primarily: 
- Control over Data 
- Flexibility by reducing reliance of external API
- Scalability: Spring Boot applications can be easily scaled horizontally, allowing you to handle increased load and more complex operations.
- Business Logic: Embed complex business logic within your services, which might not be possible or practical with third-party APIs.

The drawbacks are:
- Increased complexity with back-end development. The current Spring Boot app uses reactive Spring dependencies from which the learning curve could be quite difficult for students who have only foundational Java. We adopted reactive Spring dependencies to leverage non-blocking I/O and improve the scalability and responsiveness of our application. By using Spring WebFlux and Project Reactor, we can efficiently handle a high volume of concurrent requests. This approach allows us to process real-time data streams, ensuring a smooth user experience even under heavy load. Reactive programming aligns well with our microservices architecture and integrates seamlessly with our reactive data sources, providing a modern and future-proof solution for our backend services.
- Increased complexity with future deployment plans. 

Documentation:
- [Spring Boot](https://docs.spring.io/spring-boot/index.html)
- [React](https://react.dev/) 
- [REST](https://restfulapi.net/) 

Configuration:
MongoDB https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/ 
1. Clone `the-zone-api`
2. Create `applicaiton.properties` under `/resources`
3. Add `spring.data.mongodb.uri` and `spring.data.mongodb.database` properties
4. Add `spring.data.mongodb.auto-index-creation=true`and `spring.application.name=The Zone API`
5. Add `news-api.key`
6. Run TheZoneApiApplication

Languages:
- Java SDK 17
- React Framework
- Spring Boot 3
- JSON
- TypeScript
  
<h3>Resources</h3>
