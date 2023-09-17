FROM amazoncorretto:20-alpine-full
RUN apk update && apk upgrade
WORKDIR /app
COPY . .
RUN chmod +x mvnw
RUN ./mvnw install
EXPOSE 5000 8080
ENTRYPOINT [ "./mvnw", "spring-boot:run", "-Dspring-boot.run.arguments=--backendIP=http://kbcaptcha-python-backend:5000" ]
