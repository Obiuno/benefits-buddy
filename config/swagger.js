import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Benefits Buddy API",
      version: "1.0.0",
      description: "API documentation for the Benefits Buddy backend services",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Development Server",
      },
    ],
  },
  apis: ["../backend/routes/*.js", "../backend/controllers/*.js"],
};

export const specs = swaggerJSDoc(options);
