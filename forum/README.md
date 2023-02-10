# Forum

## Development

**Make sure you are within the `./forum` directory.**

Prerequisites: Node v18+; PNPM (or NPM etc.); Docker; Docker Compose.

1. Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

2. Start PostgreSQL

```bash
docker-compose up -d
```

3. Install Node dependencies

```bash
pnpm install
# Or, npm install
```

4. Run PostgreSQL migrations

```bash
pnpm prisma migrate deploy
# Or, npm prisma migrate deploy
```

5. Start Express server (API)

```bash
pnpm start
# Or, npm start
```
