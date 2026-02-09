// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // OpenAPI version
    info: {
      title: 'My API Documentation',
      version: '1.0.0',
      description: 'This is a sample API documentation using Swagger in Node.js',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Change to your actual server URL
      },
    ],
  },
  apis: ['./routes/*.js','./Task/*.js','./Weatherforcast/*.js','./app.js'], // Path to the API docs (adjust if needed)
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
