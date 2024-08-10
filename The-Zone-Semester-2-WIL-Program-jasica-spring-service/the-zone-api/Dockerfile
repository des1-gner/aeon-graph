# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file from the target directory
COPY target/zone-api.jar /app/zone-api.jar

# Expose the port your Spring Boot application is running on
EXPOSE 8081

# Run the JAR file
ENTRYPOINT ["java","-jar","/app/zone-api.jar"]
