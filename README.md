# Blog App

A simple content management application built with **Node.js**, **Express**, **React**, and **SQLite3**.

## Features
- Dynamic blog posts.
- User authentication.
- Responsive design.
- Rich text editing.
- Images and video embedding.

## Tech Stack
- Node.js
- Express.js
- React
- SQLite3
- Tailwind CSS

## Extra npm packages ##
* Several Extra Packages Installed see package.json file the main packages are listed here.
* BACKEND:
    * Express <!--Router and middleware. -->
    * Cors <!--Restrics acces to server. -->
    * Bcrypt <!--Encryption and decryption of tokens for user authentication. -->
    * JsonWebToken <!--Creation and Authentication of tokens. -->
    * Express-rate-limit <!--Limits requests per IP / time, increased security. -->
    * Cloudinary <!--Images hosting. -->
    * Nodemon - installed to speed up a bit the development process and avoid restarting the server all the time

* FRONT END:
    * React
    * Tiptap core and extensions. <!--For Rich text editting. -->
    * Socket.io <!--Push updates without page reload. -->

##### ----------How to Run Locally--------- #####
##### Clone Git Repository - STEP 1 
```bash
git clone https://github.com/guiconci/blog_app.git
cd blog_app
cd backend
npm install
```
<!-- This is needed in order to download install bcrypt and hash password -->
## Encryp password - STEP 2 
* Create a file "hash-password.js" with the content:
    const bcrypt = require("bcrypt");
    bcrypt.hash("MyPortifolio1993*", 10).then(console.log);
* THEN RUN IT THROUGH CMD
```bash
node hash-password.js
```
* Copy the printed out hashed password and paste in the ADMIN_PASSWORD_HASH in the backend .env file.
    * See bellow.

## Installation/Initialization requirements - STEP 3 
* For images Upload from PC, a Cloudinary account has to be setup.
    * To load images from URL not needed initially.
* Setup .env Files with Environmental Variables
    * BACKEND FOLDER .env:
        NODE_ENV =development <!-- development or production -->
        CLOUDINARY_CLOUD_NAME= <!-- Set up cloudinary account -->
        CLOUDINARY_API_KEY= <!-- Set up cloudinary account -->
        CLOUDINARY_API_SECRET= <!-- Set up cloudinary account -->
        ADMIN_USERNAME= <!-- define username for Admin -->
        ADMIN_PASSWORD_HASH= <!-- HASH ACQUIRED AT STEP 2 -->
        JWT_SECRET= <!-- Random string used to encrypt and decrypt tokens example: 8fde0b16c864fd09163d79df28f5ea80b9485710a2f78-->
        ENABLE_LEGACY_ROUTES=false <!-- Internal app setup, old EJS routes, stil kept for now -->
        FRONTEND_URL=http://localhost:5173 <!-- LocalServer for frontend for CORS enabling -->

    * FRONTEND (Client folder) .env:
        REACT_APP_API_URL=http://localhost:3000 <!-- LocalServer for backend -->

## Installation/Initialization requirements - STEP 4
* Install Docker.
* Open terminal in blog_app folder (Where is docker-compose.yml)
* THEN RUN
```bash
docker desktop start
docker compose build
docker compose up
```
* FRONTEND SHOULD BE RUNNING ON http://localhost:5173

## During Development ##
* Frontend changes are live, no container restart needed.
* Backend changes require container reinitialization.
```bash
docker compose restart backend
```
* To remove containers 
```bash
docker compose down
```
* To rebuild from scratch without cache
```bash
docker compose build --no-cache
```

##### ----------LIVE DEPLOYMENT--------- #####
* Done through Render
* Setup account
* Create project
* Add services
    * Direct each service to correct repository subfolder (backend or client)
* Setup enviromental variables for BACKEND service
    * Sames as .env file above
    * Except URLs that are not to locallhost anymore
* Add persistent volume to backend app/src/database
    * This allows us to maintain data through rebuilds
* Deploy both services







