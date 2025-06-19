/**
* index.js
* main app entry point
*/

// Set up express, bodyparser and EJS
const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
require('dotenv').config();



// 🔹 NEW: LiveReload setup (only for development)
// const livereload = require("livereload");
// const connectLiveReload = require("connect-livereload");
const path = require('path'); // already imported later, just moved up here
// const chokidar = require('chokidar'); //watch changes in files

// only runs live reload if NODE_ENV is not set to production in docker file
// if (process.env.NODE_ENV !== 'production') {
//     const liveReloadServer = livereload.createServer({ port: 35729, host: "0.0.0.0" });

//     //watches views and public folders
//     const watcher = chokidar.watch([
//         path.join(__dirname, 'views'),
//         path.join(__dirname, 'public')
//       ], {
//         ignoreInitial: true,
//         usePolling: process.env.USE_CHOKIDAR_POLLING === 'true',
//         interval: 300, // ms between checks (if polling)
//       });

//       watcher.on('ready', () => {
//         console.log('👀 Chokidar is watching...');
//         console.log(watcher.getWatched());
//       });
      
//       watcher.on('change', (filePath) => {
//         console.log('🔁 File changed:', filePath);
//         liveReloadServer.refresh('/');
//       });

//     console.log('LiveReload server listening on port 35729');

//     liveReloadServer.server.on('connection', () => {
//         console.log('✅ LiveReload WebSocket connected');
//     });

//     liveReloadServer.watch([
//         path.join(__dirname, 'public'), 
//         path.join(__dirname, 'views')
//     ]);
    

//     app.use(connectLiveReload());

// }

// Middleware
app.use(bodyParser.json()); // set up to parse json
app.use(bodyParser.urlencoded({ extended: true })); //parse form data
app.set('view engine', 'ejs'); // set the app to use ejs for rendering
app.use(express.static(__dirname + '/public')); // set location of static files
 
// Set up SQLite
// Items in the global namespace are accessible throught out the node application
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Use DB_PATH from environment variable, or to local db for development
const dbPath = process.env.DB_PATH || './database/database.db';
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
            console.error("Error initializing DB schema: ", err.message);
        }
        else {
            console.log("Database schema created successfully");
        }
    })
}

// Handle requests to the home page 
app.get('/', (req, res) => {
    // res.send('Hello World!')
    res.render('index');
});

// Add all the route handlers in usersRoutes to the app under the path /users

const cors = require("cors");
app.use(cors({
  origin: "https://www.gconci.com",
  credentials: true,
  methods: ["GET", "POST"]
}));

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

const viewsRoutes = require('./routes/views');
app.use('/', viewsRoutes);

const blogSettingsRoutes = require('./routes/blog-settings');
app.use('/', blogSettingsRoutes);

const blogPostsRoutes = require('./routes/blog-posts');
app.use('/', blogPostsRoutes);

// Image uploade file routes
const imageUploadRoutes = require('./routes/images');
app.use('/', imageUploadRoutes);

const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

// Make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

