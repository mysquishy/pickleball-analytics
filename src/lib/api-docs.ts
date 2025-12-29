/**
 * OpenAPI/Swagger Documentation Generator
 * Auto-generates API documentation from route handlers
 */

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My SaaS API',
      version: '1.0.0',
      description: 'Production-ready SaaS API with authentication, billing, and multi-tenancy',
      contact: {
        name: 'API Support',
        email: 'support@yourdomain.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://your-production-url.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            name: {
              type: 'string',
              description: 'User name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            role: {
              type: 'string',
              enum: ['OWNER', 'ADMIN', 'MEMBER'],
              description: 'User role in organization',
            },
          },
        },
        Organization: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Organization ID',
            },
            name: {
              type: 'string',
              description: 'Organization name',
            },
            slug: {
              type: 'string',
              description: 'Organization slug',
            },
          },
        },
        Subscription: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Subscription ID',
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'CANCELED', 'TRIALING', 'PAST_DUE'],
            },
            priceId: {
              type: 'string',
              description: 'Stripe price ID',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts', './src/app/api/**/*.tsx'],
};

export const swaggerSpec = swaggerJsdoc(options);

/**
 * API endpoint documentation
 * Add JSDoc comments to route handlers to auto-generate docs
 *
 * @example
 * /**
 *  * @swagger
 *  * /api/users:
 *  *   get:
 *  *     summary: Get all users
 *  *     tags: [Users]
 *  *     security:
 *  *       - bearerAuth: []
 *  *     responses:
 *  *       200:
 *  *         description: List of users
 *  *         content:
 *  *           application/json:
 *  *             schema:
 *  *               type: array
 *  *               items:
 *  *                 $ref: '#/components/schemas/User'
 *  *\/
 */
