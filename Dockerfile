# Step 1: Build Frontend (React + Vite)
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Step 2: Build Backend (Spring Boot + Java 21)
FROM maven:3.9.9-eclipse-temurin-21-alpine AS backend-build
WORKDIR /app
COPY backend/pom.xml ./pom.xml
COPY backend/src ./src
# Copy compiled React frontend into Spring Boot static web resources
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static
RUN mvn clean package -DskipTests

# Step 3: Run the All-in-One Fullstack Application
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["sh", "-c", "java -Dserver.port= -jar app.jar"]