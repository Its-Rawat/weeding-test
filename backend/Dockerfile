# Build Backend with embedded pre-compiled React frontend
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
ENV MAVEN_OPTS="-Xmx1024m"
COPY pom.xml ./pom.xml
COPY src ./src
RUN mvn clean package -DskipTests

# Run the All-in-One Fullstack Application
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN mkdir -p /app/database
COPY --from=build /app/target/*.jar app.jar
EXPOSE 10000
ENV PORT=10000
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-10000} -jar app.jar"]
