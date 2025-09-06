# Brixo IFSC Service Assessment

End-to-end implementation for the Backend Engineer assignment. Stack: Express + TypeScript, MongoDB (Mongoose), Redis caching, Razorpay IFSC provider, with clean separation for easily adding more providers.

## Features
- **GET /api/v1/ifsc/:code** → Returns IFSC details, using Redis cache, DB, or external provider as needed.
- **GET /health** → Health check endpoint.
- **Swagger docs** available at `/docs`.
- **Smart freshness**: If DB record is older than `STALE_DAYS`, refresh from provider and update DB.
- **Redis cache**: Short TTL (`REDIS_TTL_SECONDS`) for hot IFSC codes.
- **Extensible provider interface**: Add more IFSC providers with minimal changes.
- **Dockerized**: `docker-compose up --build` brings up app, MongoDB, and Redis.
- **Tests**: Unit tests for service logic (mock external calls).
## Quickstart (Docker)
```bash
cp .env.example .env
docker compose up --build
```
Then visit: `http://localhost:3000/api/v1/ifsc/HDFC0CAGSBK`

## Local Dev (no Docker)
- Ensure MongoDB and Redis are running locally.
- Set `.env` accordingly.
```bash
npm i
npm run dev
```

## API
### GET /api/v1/ifsc/:code
**Query params**
- `refresh=true` (optional) → forces a fresh fetch from provider, bypassing DB if present.

**200 Response**
```json
{
  "code": "HDFC0CAGSBK",
  "bank": "HDFC Bank",
  "branch": "AGAR",
  "address": "...",
  "city": "AGAR",
  "district": "AGAR",
  "state": "MADHYA PRADESH",
  "contact": "123456",
  "centre": "AGAR",
  "rtgs": true,
  "neft": true,
  "imps": true,
  "micr": "NA",
  "swift": null,
  "iso3166": "IN",
  "lastUpdated": "2025-09-06T00:00:00.000Z",
  "provider": "razorpay"
}
```

**404 Response**
```json
{ "error": "IFSC code not found" }
```

**400 Response**
```json
{ "error": "Invalid IFSC format" }
```

## Config
| Key | Default | Notes |
| --- | --- | --- |
| `STALE_DAYS` | 7 | If record older than this, refetch from provider |
| `REDIS_TTL_SECONDS` | 300 | Cache TTL for IFSC entries |
| `RAZORPAY_IFSC_BASE` | https://ifsc.razorpay.com | Base URL for Razorpay IFSC API |

## Project Structure
```
src/
  app.ts
  config.ts
  db.ts
  cache.ts
  utils/httpClient.ts
  controllers/ifscController.ts
  models/Ifsc.ts
  services/ifscService.ts
  services/ifscProvider.ts
  services/providers/razorpayProvider.ts
test/
  ifscService.test.ts
docker/
  Dockerfile
  docker-compose.yml
```

## Extending Providers
- Implement `IfscProvider` interface in `src/services/ifscProvider.ts`.
- Register it in `ifscService.ts` providers array with priority order.
- Optionally add provider-specific config in `.env`.

## Notes
- This service follows the assignment requirements including API endpoint, external API integration, DB layer with freshness window, Redis cache, and extensibility.
- See assignment PDF for details.
