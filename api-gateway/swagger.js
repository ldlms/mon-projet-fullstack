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
    },
    "/user/:id": {
      get: { 
        summary: "Proxy vers user-service pour obtenir un utilisateur par ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID de l'utilisateur"
          }
      ],
      }
    },
    "/user/:id": {
      delete: { 
        summary: "Proxy vers user-service pour supprimer un utilisateur par ID",
        parameters: [
          {
            id: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID de l'utilisateur"
          }
        ],
      }
    },
    "/user/all":{
      get:{
        summary: "proxy vers user service pour ",
      }
    },
    "/user/": {
      post: {
        summary: "Proxy vers user-service pour créer un nouvel utilisateur",
        parameters: [
          {
            name: "body",
            in: "body",
            required: true,
            description: "Données de l'utilisateur à créer",
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                email: { type: "string" },
                password: { type: "string" }
              }
            }
          }
        ],
        responses: {
          201: { description: "Utilisateur créé avec succès" }
      }
    }
  },
}
};

export default swaggerSpec;