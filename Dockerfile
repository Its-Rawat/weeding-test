# Step 1: Build Frontend (React + Vite)
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN mkdir -p /app/src/main/resources/static
RUN npm run build

# Step 2: Build Backend (Spring Boot + Java 21)
FROM maven:3.9.9-eclipse-temurin-21-alpine AS backend-build
WORKDIR /app
ENV MAVEN_OPTS="-Xmx1024m"
COPY pom.xml ./pom.xml
COPY src ./src
# Copy compiled React frontend into Spring Boot static web resources
COPY --from=frontend-build /app/src/main/resources/static/ ./src/main/resources/static/
RUN mvn clean package -DskipTests

# Step 3: Run the All-in-One Fullstack Application
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN mkdir -p /app/database
COPY --from=backend-build /app/target/*.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-8080} -jar app.jar"]
