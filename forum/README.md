# Forum

## Development

**Make sure you are within the `./forum` directory.**

Prerequisites: Node v18+; PNPM (or NPM etc.); Docker; Docker Compose.

1. Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

2. Start Mongo

```bash
docker-compose up -d
```

3. Install Node dependencies

```bash
pnpm install
# Or, npm install
```

4. Start Express server (API)

```bash
pnpm start
# Or, npm start
```
