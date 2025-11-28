// src/swagger.js
const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "API Gateway",
    version: "1.0.0",
    description: "Documentation de l'API Gateway",
  },
  servers: [
    { url: "http://localhost:5000" }  
  ],
  paths: {
    "/users": {
      get: {
        summary: "Proxy vers user-service",
        responses: {
          200: { description: "health check for the api-service" }
        }
      }
    },
    "/cards": {
      get: {
        summary: "Proxy vers card-service",
        responses: {
          200: { description: "health check for the card-service" }
        }
      }
    }
  }
};

export default swaggerSpec;