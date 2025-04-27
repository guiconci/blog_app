/**
* index.js
* main app entry point
*/

// Set up express, bodyparser and EJS
const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // set the app to use ejs for rendering
app.use(express.static(__dirname + '/public')); // set location of static files

// Set up SQLite
// Items in the global namespace are accessible throught out the node application
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Use DB_PATH from environment variable, or to local db for development
const dbPath = process.env.DB_PATH || './database.db';
const schemaPath = path.join(__dirname, 'db_schema.sql')

//Checks if db exsists in volume
const dbExists = fs.existsSync(dbPath);

//Connect to SQLite and creates the file if it doesnt exists, based on schema
global.db = new sqlite3.Database(dbPath, function(err){
    if(err){
        console.error(err);
        process.exit(1); // bail out we can't connect to the DB
    } else {
        console.log(`Database connected at: ${dbPath}`);
        //global.db.run("PRAGMA foreign_keys=ON"); // tell SQLite to pay attention to foreign key constraints

        if(!dbExists) {
            console.log("Database does not exist, initializing from schema...")
            initializeDatabaseSchema ();
        }
        else {
            console.log ("Database exists, skippng schema initialization")
        }

        global.db.run("PRAGMA foreign_keys=ON", function(fkErr) {
            if (fkErr) {
                console.error("Failed to enable foreign keys:", fkErr);
            } else {
                console.log("Foreign key constraints enabled");
            }
        });
    }
});

//Function nto initalize database from schema file
function initializeDatabaseSchema() {
    const schemaSQL = fs.readFileSync(schemaPath, 'utf-8')

    db.exec(schemaSQL, (err) => {
        if (err) {
            console.error("Error initializing DB schema");
        }
        else {
            console.log("Database schema created successfully");
        }
    })
}


// Handle requests to the home page 
app.get('/', (req, res) => {
    // res.send('Hello World!')
    res.render('index.ejs');
});

// Add all the route handlers in usersRoutes to the app under the path /users
const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

const viewsRoutes = require('./routes/views');
app.use('/', viewsRoutes);

const blogSettingsRoutes = require('./routes/blog-settings');
app.use('/', blogSettingsRoutes);

const blogPostsRoutes = require('./routes/blog-posts');
app.use('/', blogPostsRoutes);


// Make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

