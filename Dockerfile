FROM eclipse-temurin
VOLUME /tmp
COPY target/*.jar app.jar
#EXPOSE 8443
EXPOSE 8080
RUN export SPRING_CONFIG_NAME=application,jdbcexport 
RUN export SPRING_CONFIG_LOCATION=file:///Users/home/config
ARG CONFIG_PATH="/config"
RUN mkdir $CONFIG_PATH
ENV CONFIG_PATH_ENV=$CONFIG_PATH
ENTRYPOINT ["java","-jar","/app.jar","--spring.config.location=classpath:$CONFIG_PATH_ENV/application.properties"]
