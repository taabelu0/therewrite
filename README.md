# TheRewrite

Brief description of the project.

## Getting Started

These instructions will get your copy of the project up and running on your local machine.

### Prerequisites

- Java JDK 17 (or later)
- Apache Maven 3.9.1
- Node.js 20.9.0 (npm 10.1.0)

### Installing and Running the Full Application

1. **Clone the Repository**

2. **Run the Spring Boot Application**
Start the Spring Boot server with maven:
    ```bash
    mvn spring-boot:run
    ```

3. **Access the Application**
Available at `http://localhost:8080/`.

### React Development

For front-end development with React:

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
   npm start
   ```
   This starts the development server, accessible at `http://localhost:3000`. The front-end can be developed independently of the Spring Boot backend in this mode.
4. **Build Changes**
   To apply the changes made in the react-app navigate to "src/main/react-app" (step 1) and execute the bash script "build.sh":
   ```bash
   sh build.sh
   ```
   On Windows use a bash terminal (Git Bash)
   


## License
tbd


