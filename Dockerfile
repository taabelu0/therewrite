FROM eclipse-temurin
VOLUME /tmp
COPY target/*.jar app.jar
EXPOSE 8080
EXPORT SPRING_CONFIG_NAME=application,jdbcexport SPRING_CONFIG_LOCATION=file:///Users/home/config java -jar app.jar
ENV SPRING_CONFIG_NAME=application,jdbc
ENV SPRING_CONFIG_LOCATION=file:///Users/home/config
ENTRYPOINT ["java","-jar","/app.jar"]
