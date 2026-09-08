# Stage 1: Build the application
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies
RUN mvn dependency:go-offline
# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8081
# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
