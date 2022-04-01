# drived from the offical mysql image
FROM mysql
# create the Db
ENV MYSQL_DATABASE signal-db
COPY ./sql-scripts/ /docker-entrypoint-initdb.d/
