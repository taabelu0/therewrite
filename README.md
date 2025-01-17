# TheRewrite

Project Documentation: https://ip34-23vt.pages.fhnw.ch/ip34-23vt_therewrite/therewrite/

These instructions will get your copy of the project up and running on your local machine.

### Prerequisites

- Java JDK 17
- Apache Maven 3.9.1
- Front-end build and development purposes: Node.js 20.9.0 -> npm 10.1.0
- PostgreSQL: version 7.8 (pgAdmin4)

### Installing and Running the Full Application

1. **Clone the Repository**

2. **Configuration**
The application.properties (src/main/resources/application.properties) file needs to be configured as follows:
- The first 2 spring servlet configurations do not need additional configuration.
- The app configurations are only for front-end development. The default app.url is "http://localhost:3000".
- The app.access does not need any adaptation.
- Our development default for spring.datasource.url is "jdbc:postgresql://localhost:5432/TheRewrite", you can change this depending on your database setup.
- Set the appropriate username and password for your postgresql setup.
- On first initialization set the spring.jpa.hibernate.ddl-auto to "create-drop" (without ").
- For the database to persist change to "update" (without ") on consecutive application-startups.
```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
spring.mvc.throw-exception-if-no-handler-found=true
spring.web.resources.add-mappings=false
# node app url:
app.url=<frontend-localhost>
app.access=/api/**,/view/*,/ws,/**
# database connection:
spring.datasource.url=jdbc:postgresql://<database-url>
spring.datasource.username=<postgres-username>
spring.datasource.password=<postgres-password>

spring.jpa.hibernate.ddl-auto=<create-drop/update(see description)>
# spring.profiles.active=dev #For Development only
```

3.**Run the Spring Boot Application**
Start the Spring Boot server with maven:
    ```bash
    sh build.sh
    ```
    

4.**Access the Application**
Available at `http://localhost:8080/`.

### Development

Local react development is currently not supported due to authentication issues -> complete the first (Navigation) and second (Dependency installation) step then proceed with the full application setup and run the file "devBuild.sh" instead of "build.sh"

An administrator user will be automatically created if the following configuration is present in the application.properties:
```properties
spring.profiles.active=dev
```
You can find the user details in "src/main/java/ch/fhnw/therewrite/SetupDataLoader".


Node or React are not requirements and only used for front-end development.
The Spring-Boot application uses the build (product of build.sh) of the React App. 
Development with React:

1. **Navigate to the React Directory**
   ```bash
   cd src/main/react-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the React Development Server**
   ```bash
   sh start.sh
   ```
   This starts the development server, accessible at `http://localhost:3000`. The front-end can be developed independently of the Spring Boot backend in this mode.


4. **Build Changes**
   To apply the changes made in the react-app to the spring-application: navigate to `src/main/react-app` (step 1) and execute the bash script `build.sh`:
   ```bash
   sh build.sh
   ```
   On Windows use a bash terminal (Git Bash).


## License
tbd


