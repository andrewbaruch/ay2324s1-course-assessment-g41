docker-compose rm -f

docker volume rm ay2324s1-course-assessment-g41_3219User
docker volume rm ay2324s1-course-assessment-g41_mongo
docker volume rm ay2324s1-course-assessment-g41_postgres

docker-compose build --no-cache
docker-compose up


