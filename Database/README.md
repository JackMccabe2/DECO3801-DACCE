DECO3801 Database;

Hi! In order to run the game, you must first initialize a database with the following instructions:

- Install psql:
    npm install psql
- Enter into database with:
    psql postgres   
- Create user and password with:
    CREATE USER name WITH PASSWORD password
- To view database, user and port info:
    \conninfo
- Exit out of database:
    exit
- Initialize database with:
    psql -U 'username' -d 'database' -a -f 'filename'

To view the database structure, refer to file 'psql_database.sql' which is in this current folder.