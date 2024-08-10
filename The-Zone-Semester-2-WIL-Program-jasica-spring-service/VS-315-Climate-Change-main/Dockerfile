# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file from the target directory
COPY target/backend.jar /app/backend.jar

# Expose the port your Spring Boot application is running on
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java","-jar","/app/backend.jar"]
