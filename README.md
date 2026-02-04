# garden-api

Simple herb garden API with JWT authentication. Provides CRUD endpoints for a small SQLite-backed "plants" table and a `/login` endpoint to obtain a bearer token.

Quick start
- Install dependencies:

```bash
npm install
```

Optional: install `jq` (recommended) for parsing JSON responses in the examples below.

Preferred (Homebrew):

```bash
brew install jq
```

Manual (no brew, vendored binary included):

```bash
# this repository includes a local vendor/jq binary for quick use
./vendor/jq --version

# or copy it to a directory in your PATH, for example:
# mkdir -p "$HOME/.local/bin" && cp vendor/jq "$HOME/.local/bin/jq" && chmod +x "$HOME/.local/bin/jq"
```

- Create a `.env` file (recommended) with at minimum:

```
JWT_SECRET=replace_this_with_a_strong_secret
DEMO_USER=admin
DEMO_PASS=password
PORT=3000
```

- Run locally:

```bash
npm start
```

Get a token (example using default demo credentials):

```bash
curl -s -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username":"admin","password":"password"}' | jq
```

Example endpoints (replace <TOKEN> with the JWT):

- List plants:

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/plants
```

- Add a plant:

```bash
curl -X POST -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"name":"Basil"}' http://localhost:3000/plants
```

- Update a plant (fix spelling):

```bash
curl -X PUT -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"name":"Basilicum"}' http://localhost:3000/plants/1
```

- Delete a plant:

```bash
curl -X DELETE -H "Authorization: Bearer <TOKEN>" http://localhost:3000/plants/1
```

Deploy to Fly.io (brief):

1. Install `flyctl` and log in: `flyctl auth login`.
2. Create an app: `flyctl apps create` and update `fly.toml` with the app name.
3. Set secrets on Fly: `flyctl secrets set JWT_SECRET="your_secret" DEMO_USER=... DEMO_PASS=...`
4. Deploy: `flyctl deploy --remote-only` (or just `flyctl deploy`).