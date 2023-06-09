(docker-compose -f docker-compose.prod.yaml down) || exit 0 # If it's not running, just ignore the stop instruction
git pull
(docker-compose -f docker-compose.prod.yaml up --build -d)