# XXX: Ensure any ports updated here are also updated in survivor-frontend/tests/end-to-end/environment.ts

set -e
echo 'Starting trends'
cd trends
E2E_DB_PORT=27017 docker compose -f docker-compose-e2e.yml up -d --remove-orphans
cd ..

echo 'Starting forum'
cd forum
E2E_DB_PORT=5432 docker compose -f docker-compose-e2e.yml up -d --remove-orphans
cd ..

echo 'Starting chat'
cd chat
E2E_DB_PORT=27018 docker compose -f docker-compose-e2e.yml up -d --remove-orphans
cd ..

echo 'Starting reports'
cd reports
E2E_DB_PORT=27019 docker compose -f docker-compose-e2e.yml up -d --remove-orphans
cd ..

echo 'Starting resources'
cd resources
E2E_DB_PORT=27020 docker compose -f docker-compose-e2e.yml up -d --remove-orphans
cd ..

echo 'Starting auth'
cd auth
E2E_DB_PORT=27021 docker compose -f docker-compose-e2e.yml up -d --remove-orphans
cd ..

echo 'Starting survivor frontend'
cd survivor-frontend && docker compose -f docker-compose-e2e.yml up -d --remove-orphans
cd ..

echo 'Starting HAProxy Gateway'
cd gateway && docker compose -f docker-compose-e2e.yml up -d --remove-orphans
cd ..

docker ps

set +e
net=oxfamsurvivorscommunity
docker network create $net
docker network connect $net reports-api-1
docker network connect $net resources-api-1
docker network connect $net chat-api-1
docker network connect $net auth-api-1
docker network connect $net forum-api-1
docker network connect $net trends-api-1
docker network connect $net trends-rabbitmq-1
docker network connect $net survivor-frontend-web-1
docker network connect $net gateway-proxy-1

exit 0;
