/**
 * API Documentation Page
 * Displays Swagger UI for interactive API documentation
 */

'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SwaggerUI
        url="/api/docs"
        docExpansion="list"
        defaultModelExpandDepth={1}
        defaultModelsExpandDepth={1}
        deepLinking
        tryItOutEnabled
        persistAuthorization
        requestInterceptor={(req) => {
          // Add auth token if available
          const token = localStorage.getItem('auth-token');
          if (token) {
            req.headers.Authorization = `Bearer ${token}`;
          }
          return req;
        }}
      />
    </div>
  );
}
