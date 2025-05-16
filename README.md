# DECO3801-DACCE

### Starting the DACCE Project in dev mode

Welcome to Cool Hack Game!

To run the game there are a couple of dependencies:
- Firstly, a functioning database (refer to README in Database folder)
- Secondly, Docker must be installed

To run the game, enter this in command line:
- create a '.env' file in this directory with the following structure:

    POSTGRES_USER=user
    POSTGRES_PASSWORD=password
    POSTGRES_DB=database

    import your values created from the database initialization.

- next, run the following command in the terminal:

    docker-compose up --build

    Which will run the game on your local computer.
    To access the game, click on or type in: 
        "http://localhost:5173/"
