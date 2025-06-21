//routes for ejs templates
const express = require("express");
const router = express.Router();
const authenticateToken = require("../utils/authentication");
const ENABLE_LEGACY_ROUTES = process.env.ENABLE_LEGACY_ROUTES === 'true';


// Route to index page
router.get("/", (req, res, next) => {

});

// Handles requests to the author-home page NEW - FOR REACT APP
router.get("/api/author-home", (req, res, next) => {
    const sqlSettings = "SELECT * FROM blog_settings LIMIT 1";
    db.get(sqlSettings, (err, settings) => {
        if (err) return res.status(500).json({ error: "Failed to fetch blog settings." });

        const sqlPosts = `
            SELECT blog_posts.*, users.user_name
            FROM blog_posts
            LEFT JOIN users ON blog_posts.user_id = users.user_id
            ORDER BY blog_posts.last_modified DESC
        `;

        db.all(sqlPosts, (err, posts) => {
            if (err) return res.status(500).json({ error: "Failed to fetch posts." });

            const normalized = posts.map(p => {
                let imgs = [];
                if (typeof p.imagesList === "string" && p.imagesList.trim() !== "") {
                    try {
                        imgs = JSON.parse(p.imagesList);
                    } catch (parseErr) {
                        console.warn("Failed to parse imagesList for post", p.post_id, parseErr);
                    }
                }
                return {
                    ...p,
                    imagesList: Array.isArray(imgs) ? imgs : []
                };
            });

            res.json({
                blog_name: settings.blog_name,
                blog_description: settings.blog_description,
                author_id: settings.user_id,
                blog_posts: normalized
            });
        });
    });
});

//Set up route to the author-edit NEW REACT ROUTE - GETS EXISTING POST INFO AND RENDER IN CREATE POST PAGE
router.get("/api/author-edit", authenticateToken, (req, res, next) => {
    const { blogPostId } = req.query;
    if (!blogPostId) {
        return res.status(400).json({ error: "Missing blogPostId in query." });
    }

    const query = `
    SELECT blog_posts.*, users.user_name
    FROM blog_posts
    LEFT JOIN users ON blog_posts.user_id = users.user_id
    WHERE blog_posts.post_id = ?
  `;

    // 1) Fetch the post
    db.get(
        `SELECT * FROM blog_posts WHERE post_id = ?`,
        [blogPostId],
        (err, post) => {
            if (err) return res.status(500).json({ error: "DB error" });
            if (!post) return res.status(404).json({ error: "Post not found" });

            // 2) Check ownership or admin
            const isOwner = post.user_id === req.user.userId;
            const isAdmin = req.user.role === "admin";
            if (!isOwner && !isAdmin) {
                return res.status(403).json({ error: "Not allowed to fetch this post" });
            }

            // 3) Return the post data
            // parse imagesList if needed
            if (typeof post.imagesList === "string") {
                try { post.imagesList = JSON.parse(post.imagesList); }
                catch { post.imagesList = []; }
            }
            res.json(post);
        }
    );
});

// Route for the reader-article page NEW FOR REACT APP
router.get("/api/reader-article", (req, res, next) => {
    // Query the blog post based on the blogPostId passed from the author-home page
    let sqlquery = `SELECT blog_posts.*, users.user_name
                    FROM blog_posts
                    LEFT JOIN users ON blog_posts.user_id = users.user_id
                    WHERE blog_posts.post_id = ?
                    ORDER BY blog_posts.last_modified DESC`;
    let sqlqueryParameters = [req.query.blogPostId];
    db.get(sqlquery, sqlqueryParameters, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            //Query all blog settings from the blog_settings table joined with the users table to display user name
            let sqlquerySettings = `SELECT blog_settings.*, users.user_name
                                    FROM blog_settings
                                    LEFT JOIN users ON blog_settings.user_id = users.user_id
                                    LIMIT 1`;
            db.get(sqlquerySettings, (err, settings) => {
                if (err) {
                    console.log(err);
                } else {
                    //Query all comments for the blog_post.post_id
                    let sqlqueryComments = "SELECT * FROM comments WHERE post_id = ?";
                    let queryParameters = [req.query.blogPostId];
                    db.all(sqlqueryComments, queryParameters, (err, comments) => {
                        if (err) {
                            console.log(err);
                        } else {
                            // Format the date for each comment
                            comments.forEach(comment => {
                                let date = new Date(comment.date);
                                let day = date.getDate();
                                let month = date.getMonth() + 1; // Jan index = 0; Dec index = 11
                                let year = date.getFullYear();
                                let hour = date.getHours();
                                let minute = date.getMinutes();
                                comment.date = `${day}/${month}/${year} - ${hour}:${minute}`; // Format the date as dd/mm/yyyy
                            });

                            // Render the reader-article page with the result
                            res.json({
                                blog_post: result,
                                blog_name: settings.blog_name,
                                blog_description: settings.blog_description,
                                author_name: settings.user_name,
                                comments: comments
                            })
                        }
                    });
                }
            });
        }
    });
});

//OLD ROUTES KEPT FOR LEGACY CODE MAINTENANCE AND POSSIBLE FEATURE RE-IMPLEMENTATION
if (ENABLE_LEGACY_ROUTES) {
    // Handles requests to the author-home page FOR OLD EJS TEMPLATE TEMOPORARY
    router.get("/author-home", (req, res, next) => {
        // Query the first blog_name from the blog_settings table
        sqlquery = "SELECT * FROM blog_settings LIMIT 1";
        // sql query to get the blog name from database
        db.get(sqlquery, (err, result) => {
            if (err) {
                res.redirect("/");
            }
            else {
                // Query the blog posts from the blog_posts table
                let sqlqueryPosts = `SELECT blog_posts.*, users.user_name
                                FROM blog_posts
                                LEFT JOIN users ON blog_posts.user_id = users.user_id
                                ORDER BY blog_posts.last_modified DESC`;

                db.all(sqlqueryPosts, (err, posts) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // Query all users from the user table
                        let sqlqueryUsers = "SELECT * FROM users";
                        db.all(sqlqueryUsers, (err, users) => {
                            if (err) {
                                console.log(err);
                            } else {
                                // render the author-home page with the results
                                res.render("author-home.ejs", {
                                    blog_name: result.blog_name,
                                    blog_description: result.blog_description,
                                    author_id: result.user_id,
                                    blog_posts: posts,
                                    users: users
                                });
                            }
                        });
                    }
                });
            }
        })
    });

    //Set up route to the author-edit page OLD EJS ROUTE TEMPORARY
    router.get("/author-edit", (req, res, next) => {
        //Query the blog post based on the blogPostId passed from the author-home page
        let sqlquery = "SELECT * FROM blog_posts WHERE post_id = ?";
        let sqlqueryParameters = [req.query.blogPostId];
        db.get(sqlquery, sqlqueryParameters, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                // Query all users from the user table
                let sqlqueryUsers = "SELECT * FROM users";
                db.all(sqlqueryUsers, (err, users) => {
                    if (err) {
                        console.log(err);
                    } else {
                        //  render the author-edit page with the results
                        res.render("author-edit.ejs", {
                            blog_post: result,
                            users: users
                        });
                    }
                });
            }
        });
    });
    // Route for the reader-article page OLD FOR EJS TEMPLATE ENGINE TEMPORARY
    router.get("/reader-article", (req, res, next) => {
        // Query the blog post based on the blogPostId passed from the author-home page
        let sqlquery = `SELECT blog_posts.*, users.user_name
                    FROM blog_posts
                    LEFT JOIN users ON blog_posts.user_id = users.user_id
                    WHERE blog_posts.post_id = ?
                    ORDER BY blog_posts.last_modified DESC`;
        let sqlqueryParameters = [req.query.blogPostId];
        db.get(sqlquery, sqlqueryParameters, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                //Query all blog settings from the blog_settings table joined with the users table to display user name
                let sqlquerySettings = `SELECT blog_settings.*, users.user_name
                                    FROM blog_settings
                                    LEFT JOIN users ON blog_settings.user_id = users.user_id
                                    LIMIT 1`;
                db.get(sqlquerySettings, (err, settings) => {
                    if (err) {
                        console.log(err);
                    } else {
                        //Query all comments for the blog_post.post_id
                        let sqlqueryComments = "SELECT * FROM comments WHERE post_id = ?";
                        let queryParameters = [req.query.blogPostId];
                        db.all(sqlqueryComments, queryParameters, (err, comments) => {
                            if (err) {
                                console.log(err);
                            } else {
                                // Format the date for each comment
                                comments.forEach(comment => {
                                    let date = new Date(comment.date);
                                    let day = date.getDate();
                                    let month = date.getMonth() + 1; // Jan index = 0; Dec index = 11
                                    let year = date.getFullYear();
                                    let hour = date.getHours();
                                    let minute = date.getMinutes();
                                    comment.date = `${day}/${month}/${year} - ${hour}:${minute}`; // Format the date as dd/mm/yyyy
                                });

                                // Render the reader-article page with the result
                                res.render("reader-article.ejs", {
                                    blog_post: result,
                                    blog_name: settings.blog_name,
                                    blog_description: settings.blog_description,
                                    author_name: settings.user_name,
                                    comments: comments
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    // Route for the reader-home page
    router.get("/reader-home", (req, res, next) => {
        // Query the first blog_name from the blog_settings table
        sqlquery = `SELECT blog_settings.*, users.user_name
                FROM blog_settings
                LEFT JOIN users ON blog_settings.user_id = users.user_id
                LIMIT 1`;
        // sql query to get the blog name from database
        db.get(sqlquery, (err, result) => {
            if (err) {
                res.redirect("/");
            }
            else {
                // Query the blog posts from the blog_posts table
                let sqlqueryPosts = `SELECT blog_posts.*, users.user_name
                                FROM blog_posts
                                LEFT JOIN users ON blog_posts.user_id = users.user_id
                                WHERE blog_posts.isPublished = 1
                                ORDER BY blog_posts.last_modified DESC`;

                db.all(sqlqueryPosts, (err, posts) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // Format the date for each post
                        posts.forEach(post => {
                            let date = new Date(post.last_modified);
                            let day = date.getDate();
                            let month = date.getMonth() + 1; // Jan index = 0; Dec index = 11
                            let year = date.getFullYear();
                            post.last_modified = `${day}/${month}/${year}`; // Format the date as dd/mm/yyyy
                        });

                        // render the reader-home page with the results
                        res.render("reader-home.ejs", {
                            blog_name: result.blog_name,
                            blog_description: result.blog_description,
                            author_name: result.user_name,
                            blog_posts: posts
                        });
                    }
                });
            }
        })
    });
}


// Export the router object so index.js can access it
module.exports = router;