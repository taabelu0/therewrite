FROM eclipse-temurin
VOLUME /tmp
COPY target/*.jar app.jar
EXPOSE 8443
RUN export SPRING_CONFIG_NAME=application,jdbcexport 
RUN export SPRING_CONFIG_LOCATION=file:///Users/home/config
ENTRYPOINT ["java","-jar","/app.jar"]
