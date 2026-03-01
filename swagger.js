const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My express API",
      version: "1.0.0",
      description: "Swagger docs for my express project",
    },
    servers: [
      {
        url: process.env.BACKEND_URL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // Minimal schemas used in examples
        UserLogin: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", example: "alice" },
            password: { type: "string", example: "secret123" },
          },
        },
        UserRegister: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", example: "alice" },
            password: { type: "string", example: "secret123" },
          },
        },
        FormSave: {
          type: "object",
          properties: {
            form: {
              type: "object",
              properties: {
                title: { type: "string" },
                owner_id: { type: "string" },
                owner_username: { type: "string" },
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: {
                        type: "string",
                        enum: [
                          "Multiple Choice",
                          "Short Answer",
                          "Checkbox",
                          "Dropdown",
                        ],
                      },
                      question_text: { type: "string" },
                      required: { type: "boolean" },
                      options: { type: "array", items: { type: "string" } },
                    },
                  },
                },
              },
            },
          },
        },
        AttemptCreate: {
          type: "object",
          properties: {
            attempted_by_id: { type: "string" },
            form_id: { type: "string" },
            answers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question_id: { type: "string" },
                  answer: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
