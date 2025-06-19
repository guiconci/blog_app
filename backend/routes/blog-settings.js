//Update blog settings route
const express = require("express");
const router = express.Router();
const ENABLE_LEGACY_ROUTES = process.env.ENABLE_LEGACY_ROUTES === 'true';

if (ENABLE_LEGACY_ROUTES) {
    // Handles POST request from the author-home, UPDATES BLOG SETTINGS
    router.post("/blog-settings", (req, res, next) => {
        // Define the query
        query = "UPDATE blog_settings SET blog_name = ?, blog_description = ?, user_id = ? WHERE blog_settings_id = 1;"
        query_parameters = [req.body.blogName, req.body.blogDescription, req.body.authorId]

        // Execute the UPDATE query and redirects to the author-home page
        global.db.run(query, query_parameters,
            function (err) {
                if (err) {
                    next(err); //send the error on to the error handler
                } else {
                    res.redirect("author-home");
                }
            }
        );
    });
}

// Export the router object so index.js can access it
module.exports = router;