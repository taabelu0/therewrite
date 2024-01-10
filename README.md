# TheRewrite

Project Documentation: https://ip34-23vt.pages.fhnw.ch/ip34-23vt_therewrite/therewrite/

These instructions will get your copy of the project up and running on your local machine.

### Prerequisites

- Java JDK 17
- Apache Maven 3.9.1
- Front-end build and development purposes: Node.js 20.9.0 -> npm 10.1.0
- pgAdmin4: version 7.8 (PostgreSQL)

### Installing and Running the Full Application

1. **Clone the Repository**

2. **Configuration**
The application.properties (src/main/resources/application.properties) file needs to be configured as follows:
- The first 2 spring servlet configurations do not need additional configuration.
- The app configurations are only for front-end development. The default app.url is "http://localhost:3000".
- The app.access does not need any adaptation.
- Our development default for spring.datasource.url is "jdbc:postgresql://localhost:5432/TheRewrite", you can change this depending on your database setup.
- Set the appropriate username and password for your postgresql setup.
- On first initialization set the spring.jpa.hibernate.ddl-auto to "create".
- For the database to persist change to "update" on consecutive application-startups.
```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
# node app url:
app.url=<frontend-localhost>
app.access=/api/**
# database connection:
spring.datasource.url=jdbc:postgresql://<database-url>
spring.datasource.username=<postgres-username>
spring.datasource.password=<postgres-password>

spring.jpa.hibernate.ddl-auto=<create/update(see description)>
```

3.**Run the Spring Boot Application**
Start the Spring Boot server with maven:
    ```bash
    mvn spring-boot:run
    ```

4.**Access the Application**
Available at `http://localhost:8080/`.

### Deployment of Application

Our GitLab pipeline is defined in the .gitlab-ci.yml file at the root of the repository. This pipeline automates the building, releasing (docker), and deployment of our application.

**Key Stages of the Pipeline**
- Build: This stage runs automated tests to ensure code quality.
- Release: In this stage, the application is built.
- Deploy: This final stage deploys the application to the designated server/environment.

To get the production build running on your local machine follow these steps:
- Get the newest docker image: TBD

### React Development

Node or React are not requirements and only used for front-end development.
The Spring-Boot application uses the build (build.sh) of the React App. 
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
   To apply the changes made in the react-app navigate to `src/main/react-app` (step 1) and execute the bash script `build.sh`:
   ```bash
   sh build.sh
   ```
   On Windows use a bash terminal (Git Bash).
   


## License
tbd


