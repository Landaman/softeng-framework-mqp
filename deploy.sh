docker-compose -f docker-compose.prod.yaml down || exit 0 # Attempt to exit the prod instance, do nothing if not
docker-compose -f docker-compose.prod.yaml pull # Update containers
docker-compose -f docker-compose.prod.yaml up -d # Restart