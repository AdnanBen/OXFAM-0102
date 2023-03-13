echo 'Starting forum'
cd forum && docker-compose -f docker-compose-prod.yml pull && docker-compose -f docker-compose-prod.yml up -d --remove-orphans
cd ..

echo 'Starting chat'
cd chat && docker-compose -f docker-compose-prod.yml pull && docker-compose -f docker-compose-prod.yml up -d --remove-orphans
cd ..

echo 'Starting reports'
cd reports && docker-compose -f docker-compose-prod.yml pull && docker-compose -f docker-compose-prod.yml up -d --remove-orphans
cd ..

echo 'Starting resources'
cd resources && docker-compose -f docker-compose-prod.yml pull && docker-compose -f docker-compose-prod.yml up -d --remove-orphans
cd ..

echo 'Starting auth'
cd auth && docker-compose -f docker-compose-prod.yml pull && docker-compose -f docker-compose-prod.yml up -d --remove-orphans
cd ..

echo 'Starting trends'
cd trends && docker-compose -f docker-compose-prod.yml pull && docker-compose -f docker-compose-prod.yml up -d --remove-orphans
cd ..

echo 'Starting survivor frontend'
cd survivor-frontend && docker-compose -f docker-compose-prod.yml pull && docker-compose -f docker-compose-prod.yml up -d --remove-orphans
cd ..

echo 'Starting HAProxy Gateway'
cd gateway && docker-compose -f docker-compose-prod.yml up -d --remove-orphans
cd ..

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
