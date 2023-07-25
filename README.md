## Routes
Signup with new user (POST) : http://localhost:8000/signup 

Login with existing user (POST) : http://localhost:8000/login 

Fetch user details (authorised)(GET) : http://localhost:8000/getuser 

Logout user (authorised)(DELETE) : http://localhost:8000/logout 

Logout of all devices (authorised)(DELETE) : http://localhost:8000/logouts 

Set the user domain (authorised)(PATCH) : http://localhost:8000/setdomain 


## copying the .env.example file to .env file

|-- make a config folder in the root directory
|-- create a dev.env file
|-- copy .env.example to dev.env


## Table of Contents

- [Project Structure](#project-structure)
<!-- - [Error Handling](#error-handling)
- [Logging](#logging) -->


## Project Structure

```
src\
     |--controllers\  # Route controllers (controllers layer)
     |--db\           # Contains database setup
     |--middlewares\  # Custom express middlewares
     |--models\       # Mongoose models (data layer)
     |--public\       # Contains public files 
     |--routes\       # Routes
 |--config\           # Envoriment variables and configuration related things
 |--app.js            # Express app
 |--index.js          # App entry point

```