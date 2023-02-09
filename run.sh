docker-compose -f forum/docker-compose-prod.yml \
  -f gateway/docker-compose-prod.yml \
  # -f moderator-frontend/docker-compose.yml \
  -f reports/docker-compose-prod.yml \
  -f resources/docker-compose-prod.yml \
  -f survivor-frontend/docker-compose-prod.yml \
  up -d
