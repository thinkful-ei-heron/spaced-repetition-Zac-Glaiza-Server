## Project Name: Spaced-Repetition server

Use the spaced-repetition technique to learn twenty Latin words.

It is a collaboration between [Glaiza Wagner](https://github.com/glaizawagner) and [Zacharia Lutz](https://github.com/zacharialutz).

- [Live app](https://gz-spaced-repetition-app.now.sh)
- [Heroku](https://glaiza-zac-spaced-rep-server.herokuapp.com)
- [Client-repo](https://github.com/thinkful-ei-heron/spaced-repetition_Zac-Glaiza_client)
- [Server-Repo](https://github.com/thinkful-ei-heron/spaced-repetition_Zac-Glaiza_server)

## API Endpoints

The following are the request endpoints for this server:::

[Base URL:](https://glaiza-zac-spaced-rep-server.herokuapp.com/api)

- Auth Endpoints

    &ensp;POST api/auth/token => It is a request handler for user login to receive a JWT. It verifies credentials for login.
                      
    &ensp;PUT api/auth/token => It is a request handler for user login that allows automatic refreshing of token.

- User Endpoints

    &ensp;POST /api/user => request handler for user registration/sign-up.

- Language Endpoints

    &ensp;GET api/language => It is a request handler for dashboard page, homepage for logged in users. It retrieves current language for user.

    &ensp;GET api/language/head => It is a request handler for rendering each larning page. It retrieves the first word for the user to learn for the specified language.

    &ensp;POST api/language/guess 
    - It is a request handler for user guessing. 
    - It verifies if the user guess is equal to the translation. 
    - It uses a linked list data structure.
    - When user guesses correctly, correct count increments and memory value doubles.
    - When user guesses incorrectly, incorrect count decrements and memory value is equal 1.

## Technologies
- Node
- Express
- PostgreSQL
- Bcryptjs
- JWT
- Morgan
- Helmet
- Chai
- Supertest

Client - Deployed in Zeit </br>
Server - Deployed in Heroku 

Copyright © G&Z 2020