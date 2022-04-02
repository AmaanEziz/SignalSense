# drived from the offical mysql image
FROM mysql/mysql-server:latest
# create the Db
ENV MYSQL_DATABASE signal-db
COPY ./sql-scripts/ /docker-entrypoint-initdb.d/
