create database signalDB;

create user 'appUser'@'%' identified by 'appUserPass123!';

GRANT ALL privileges on signalDB.* TO 'appUser'@'%';
