# garden-api

A simple herb garden REST API with JWT authentication. Create, read, update, and delete plants in a SQLite database.

Live API: https://garden-api.fly.dev

## Quick Start

Get a token:
```bash
TOKEN=$(curl -s -X POST https://garden-api.fly.dev/login \
  -H "Content-Type: application/json" \
  -d '{"username":"YOUR_USERNAME","password":"YOUR_PASSWORD"}' | jq -r .token)
```

### API Endpoints

All endpoints require the Authorization: Bearer $TOKEN header.

- GET /plants — List all plants
- POST /plants — Add a plant (body: {"name":"Basil"})
- PUT /plants/:id — Update a plant's name
- DELETE /plants/:id — Remove a plant

Example:
```bash
# List
curl -H "Authorization: Bearer $TOKEN" https://garden-api.fly.dev/plants

# Add
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Mint"}' https://garden-api.fly.dev/plants

# Update
curl -X PUT -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Peppermint"}' https://garden-api.fly.dev/plants/1

# Delete
curl -X DELETE -H "Authorization: Bearer $TOKEN" https://garden-api.fly.dev/plants/1
```

## Setup (Local Development)

Install dependencies:
```bash
npm install
```

Create a .env file:
```
JWT_SECRET=your_secret_key
DEMO_USER=admin
DEMO_PASS=password
PORT=3000
```

Run:
```bash
npm start
```

Then use http://localhost:3000 instead of https://garden-api.fly.dev in the examples above.

Optional: install jq for parsing JSON (vendored binary included in ./vendor/jq).

## Tech Stack

- Server: Node.js + Express
- Database: SQLite
- Auth: JWT
- Hosting: Fly.io