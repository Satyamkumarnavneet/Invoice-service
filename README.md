# Invoice Report System

# Overview
--------

The Invoice Report System is a NestJS application that provides a set of REST API endpoints for managing invoices. This application allows you to create invoices, retrieve them by ID, and list all invoices with optional date range filters.

# Table of Contents
-----------------

*   Setup Instructions  
*   Running the Services
*   Additional Notes

Setup Instructions
------------------

To get started with the Invoice Report System, follow these steps:

1.  `git clone https://github.com/your-repository/invoice-report-system.git`
    
2.  `cd invoice-report-system`
    
3.  Ensure you have Node.js installed. Install the necessary packages using npm: `npm install`
    
4.  Make sure you have a .env file in the root directory. If not, create one and add the required environment `variables:envCopy codeMONGO\_URI=mongodb://localhost/nest`
    
5.  Ensure that MongoDB is running on your local machine or configure it according to your setup.
    

Running the Services
--------------------

1.  To start the NestJS application, run:bashCopy codenpm run startThe application will start on `http://localhost:3000` by default.
    
2. Use Postman or any HTTP client to test the API endpoints.

   - **POST /invoices**: Create a new invoice

     ```bash
     POST http://localhost:3000/invoices
     ```

     **Request Body:**

     ```json
     {
       "customer": "John Doe",
       "amount": 100,
       "reference": "INV001",
       "date": "2024-08-27T00:00:00.000Z",
       "items": [
         {
           "sku": "item001",
           "qt": 2
         }
       ]
     }
     ```

   - **GET /invoices/{id}**: Retrieve a specific invoice by ID

     ```bash
     GET http://localhost:3000/invoices/{id}
     ```

     Replace `{id}` with the actual invoice ID.

   - **GET /invoices**: Retrieve a list of all invoices

     ```bash
     GET http://localhost:3000/invoices
     ```

     **Query Parameters (optional):**

     - `startDate` - Filter invoices by start date (YYYY-MM-DD)
     - `endDate` - Filter invoices by end date (YYYY-MM-DD)


Additional Notes
----------------

*   **Folder Structure:**
    
    *   src/: Contains the main application code.
        
    *   invoice/: Contains invoice-related modules, controllers, and services.
        
    *   tasks/: Contains task-related modules and services.
        
    *   rabbitmq/: Contains RabbitMQ-related modules and services.
        
*   Ensure that your tests are correctly set up in the test/ directory. Run tests using the `npm run test`
    
*   The application connects to MongoDB. Make sure MongoDB is properly configured and running.
    
*   For production, configure additional environment variables as required.
    
*   This project uses NestJS, Mongoose, and RabbitMQ. Ensure all dependencies are up to date.
    

Feel free to reach out if you have any questions or issues!
