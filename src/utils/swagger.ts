  import { Express } from 'express';
  import swaggerUi from 'swagger-ui-express';
  import YAML from 'yamljs';

  export const swagger = (app: Express) => {
    const doc = YAML.parse(`
openapi: 3.0.0
info:
  title: Brixo IFSC API
  version: 1.0.0
paths:
  /api/v1/ifsc/{code}:
    get:
      summary: Get IFSC details
      parameters:
        - in: path
          name: code
          schema:
            type: string
          required: true
          description: IFSC code
        - in: query
          name: refresh
          schema:
            type: string
            enum: [ "true", "false" ]
          required: false
          description: Force refresh from provider
      responses:
        '200':
          description: IFSC details
          content:
            application/json:
              schema:
                type: object
                properties:
                  code: { type: string }
                  bank: { type: string }
                  branch: { type: string }
                  address: { type: string }
                  contact: { type: string }
                  city: { type: string }
                  district: { type: string }
                  state: { type: string }
                  centre: { type: string }
                  rtgs: { type: boolean }
                  neft: { type: boolean }
                  imps: { type: boolean }
                  micr: { type: string, nullable: true }
                  swift: { type: string, nullable: true }
                  iso3166: { type: string, nullable: true }
                  lastUpdated: { type: string, format: date-time }
                  provider: { type: string }
        '400':
          description: Invalid IFSC format
        '404':
          description: IFSC not found
    `);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(doc));
  };
