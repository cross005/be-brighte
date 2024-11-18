Tech Stack
Backend:

    Node.js 14 (default version, but Node.js 20 is also supported in dev and prod environments)
    TypeScript
    MySQL (can be used locally or with AWS RDS)
    Serverless Framework (for managing AWS Lambda functions and API Gateway)


Step-by-Step Setup
Backend Setup
1. Install Dependencies: To get started, run the following command to install the required Node.js packages:
    npm install
2. Install Serverless-Offline: To run the API locally with serverless-offline, install the package:
    npm install serverless-offline
3. Create the Database: Create a MySQL database called brightedb for storing the expressions of interest.
    You can create the database using a MySQL client or from the command line:
    CREATE DATABASE brightedb;
4. Create the Table: Inside the brightedb database, create the following table to store customer information:
    CREATE TABLE leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20),
    email VARCHAR(255),
    postcode VARCHAR(20),
    services VARCHAR(20)
    );
5. Run the Application Locally: Once you've set up the database, start the application locally using:
    npm run serve:app
6. Test the Application: To run tests for the backend, use the following command:
    npm run test