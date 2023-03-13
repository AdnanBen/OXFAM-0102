sudo rm -rf ./{resources,reports,forum}/docker-volumes

echo 'Starting forum'
(export LOCAL_DB_PORT=5432; export DATABASE_URL="postgresql://forum:forum@localhost:$LOCAL_DB_PORT/forum"; cd forum; docker-compose -f docker-compose.yml up --build -d --remove-orphans)

echo 'Starting chat'
(export LOCAL_DB_PORT=5433; cd chat; docker-compose -f docker-compose.yml up --build -d --remove-orphans)

echo 'Starting reports'
(export LOCAL_DB_PORT=5434; export DATABASE_URL=localhost; cd reports; docker-compose -f docker-compose.yml up --build -d --remove-orphans)

echo 'Starting resources'
(export LOCAL_DB_PORT=5435; export DATABASE_URL=localhost; cd resources; docker-compose -f docker-compose.yml up --build -d --remove-orphans)

echo 'Starting HAProxy Gateway'
(cd gateway; docker-compose -f docker-compose.yml up -d --remove-orphans)

echo 'Starting survivor frontend locally'
cd survivor-frontend
pnpm install 
SKIP_ENV_VALIDATION=1 pnpm dev
