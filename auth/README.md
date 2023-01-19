# Auth

## Development

**Make sure you are within the `./auth` directory.**

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

4. Install next-auth, @next-auth/mongodb-adapter, mongodb & nodemailer

```bash
pnpm install next-auth @next-auth/mongodb-adapter mongodb nodemailer
# Or, npm install next-auth @next-auth/mongodb-adapter mongodb nodemailer
```

5. Build

```bash
pnpm run build
# Or, npm run build
```

6. Start Express server (API)

```bash
pnpm run dev
# Or, npm run dev
```
