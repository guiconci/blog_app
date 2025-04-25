//Update blog settings route
const express = require("express");
const router = express.Router();

router.get("/edit-new-post", (req, res, next) => {
    global.db.get(`SELECT last_insert_rowid() FROM blog_posts as post_id`, (err, row) => {
        if (err) {
            next(err);
        } else {
            let sqlqueryUsers = "SELECT * FROM users";
            db.all(sqlqueryUsers, (err, users) => {
                if (err) {
                    console.log(err);
                } else {
                    //  render the author-edit page with the results
                    res.render("author-edit.ejs", {
                        blog_post: null,
                        users: users
                    });
                }
            });

        }
    });
});

// POST request to CREATE a new blog post
router.post("/create-post", (req, res, next) => {
    // Define the query
    query = `INSERT INTO blog_posts (title, content, content_summary, user_id, isPublished, last_modified, isNew) 
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`;
    query_parameters = [req.body.postTitle, req.body.postContent, req.body.postSummary,
                        req.body.authorId, 0, 0]

    // Execute the INSERT query and redirects to the edit post page for the new post containing the post_id
    db.run(query, query_parameters, function (err) {
        if (err) {
            next(err); //send the error on to the error handler
        } else {
            // Get the post_id of the new blog post
            // Redirect to the edit post page for the new post
            res.redirect("author-home");

        }
    });

});

// POST request to EDIT a blog post
router.post("/update-post", (req, res, next) => {
    // Define the query
    query = `UPDATE blog_posts SET title = ?, content = ?, content_summary = ?, 
            user_id = ?, last_modified = CURRENT_TIMESTAMP WHERE post_id = ?;`
    query_parameters = [req.body.postTitle, req.body.postContent, req.body.postSummary,
    req.body.authorId, req.body.blogPostId]

    // Execute the UPDATE query and redirects to the author-home page
    db.run(query, query_parameters,
        function (err) {
            if (err) {
                next(err); //send the error on to the error handler
            } else {
                res.redirect("author-home");
            }
        }
    );
});

// POST request to publish a blog post
router.post("/publish-post", (req, res, next) => {
    // Define the query
    query = `UPDATE blog_posts SET isPublished = 1 WHERE post_id = ?;`
    query_parameters = [req.body.blogPostId]
    // Execute the UPDATE query and redirects to the author-home page
    db.run(query, query_parameters,
        function (err) {
            if (err) {
                next(err); //send the error on to the error handler
            } else {
                res.redirect("author-home");
            }
        }
    );
});

// POST request to DELETE a blog post
router.post("/delete-post", (req, res, next) => {
    // Define the query
    query = "DELETE FROM blog_posts WHERE post_id = ?;"
    query_parameters = [req.body.blogPostId]

    // Execute the DELETE query and redirects to the author-home page
    db.run(query, query_parameters,
        function (err) {
            if (err) {
                next(err); //send the error on to the error handler
            } else {
                res.redirect("author-home");
            }
        }
    );
});

// route to add likes to the blog_posts table
router.post("/add-like", (req, res, next) => {
    // Define the query
    query = "UPDATE blog_posts SET likes = likes + 1 WHERE post_id = ?;"
    query_parameters = [req.body.blogPostId]

    // Execute the UPDATE query and redirects to the author-home page
    db.run(query, query_parameters,
        function (err) {
            if (err) {
                next(err); //send the error on to the error handler
            } else {
                res.redirect("/reader-article?blogPostId=" + req.body.blogPostId);
            }
        }
    );
});

// route to handle comments to the comments table
router.post("/add-comment", (req, res, next) => {
    // Define the query
    query = `INSERT INTO comments (content, commenter_name, post_id, comment_date) 
            VALUES (?, ?, ?, CURRENT_TIMESTAMP);`
    query_parameters = [req.body.comment, req.body.commenter, req.body.blogPostId]
    // Execute the INSERT query and redirects to the author-home page
    db.run(query, query_parameters,
        function (err) {
            if (err) {
                next(err); //send the error on to the error handler
            } else {
                res.redirect("/reader-article?blogPostId=" + req.body.blogPostId);
            }
        }
    );
});


// Export the router object so index.js can access it
module.exports = router;