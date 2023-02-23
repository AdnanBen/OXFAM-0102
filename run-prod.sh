sudo rm -rf ./{resources,reports,forum}/docker-volumes

echo 'Starting forum'
cd forum && docker-compose -f docker-compose-prod.yml up --build -d --remove-orphans
cd ..

echo 'Starting chat'
cd chat && docker-compose -f docker-compose-prod.yml up --build -d --remove-orphans
cd ..

echo 'Starting reports'
cd reports && docker-compose -f docker-compose-prod.yml up --build -d --remove-orphans
cd ..

echo 'Starting resources'
cd resources && docker-compose -f docker-compose-prod.yml up --build -d --remove-orphans
cd ..

echo 'Starting survivor frontend'
cd survivor-frontend && docker-compose -f docker-compose-prod.yml up --build -d --remove-orphans
cd ..

echo 'Starting moderator frontend'
cd moderator-frontend && docker-compose -f docker-compose-prod.yml up --build -d --remove-orphans
cd ..

echo 'Starting HAProxy Gateway'
cd gateway && docker-compose -f docker-compose.yml up -d --remove-orphans
cd ..


  #\ -f gateway/docker-compose-prod.yml
  #\ -f moderator-frontend/docker-compose.yml