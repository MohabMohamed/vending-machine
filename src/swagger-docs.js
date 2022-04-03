const swaggerJSDoc = require('swagger-jsdoc')

const swaggerDefinition = {
  info: {
    title: 'Vending Machine',
    version: '1.0.0',
    description: 'A rest APIs for vending machine'
  },
  host: 'localhost:3000',
  openapi: '3.0.1',
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'BEARER JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
}

const options = {
  swaggerDefinition,
  apis: ['./src/docs/**/*.yaml']
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec
