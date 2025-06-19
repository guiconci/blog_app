//Update blog settings route
const express = require("express");
const router = express.Router();
const authenticateToken = require("../utils/authentication");
const rateLimit = require("express-rate-limit");

const createPostLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max:      30,              // limit each IP to 30 creation calls per window
  standardHeaders: true,
  legacyHeaders:  false,
  message: { error: "Too many posts created — please try again later." }
});

const updatePostLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max:      60,              // 60 updates per IP per hour
  standardHeaders: true,
  legacyHeaders:  false,
  message: { error: "Too many edits — slow down a bit!" }
});

// 10 deletions per hour
const deleteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      10,
  standardHeaders: true,
  legacyHeaders:  false,
  message: { error: "Too many deletions—please wait before deleting more posts." }
});

// 60 toggles per hour
const toggleLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      60,
  standardHeaders: true,
  legacyHeaders:  false,
  message: { error: "Too many toggles—please slow down." }
});


// Route to get data from existing post for editting OLD ROUTE FOR EJS TEMPORARY
router.get("/edit-new-post", (req, res, next) => {
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
});

// POST request to CREATE a new blog post
router.post("/api/create-post", authenticateToken, createPostLimiter, (req, res, next) => {
    // Define the query
    query = `INSERT INTO blog_posts (title, content, content_summary, thumbnailUrl, thumbnailPublicId, imagesList, user_id, isPublished, showOnHome, last_modified) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;
    query_parameters = [req.body.postTitle, req.body.postContent, req.body.postSummary,
    req.body.thumbnailUrl, req.body.thumbnailPublicId, req.body.imagesList, req.body.authorId, 0, 0]

    // Execute the INSERT query and redirects to the edit post page for the new post
    db.run(query, query_parameters, function (err) {
        if (err) return next(err);
        res.json({ success: true, postId: this.lastID });
    });

});

// POST to EDIT a blog post (protected + ownership check)
router.post("/api/update-post", authenticateToken, updatePostLimiter, (req, res, next) => {
    const {
        blogPostId,
        postTitle,
        postContent,
        postSummary,
        thumbnailUrl,
        thumbnailPublicId,
        imagesList
    } = req.body;

    // 1) Lookup who owns this post
    db.get(
        `SELECT user_id FROM blog_posts WHERE post_id = ?`,
        [blogPostId],
        (err, row) => {
            if (err) return res.status(500).json({ error: "DB error" });
            if (!row) return res.status(404).json({ error: "Post not found" });

            // 2) Verify the requester is owner or admin
            const isOwner = row.user_id === req.user.userId;
            const isAdmin = req.user.role === "admin";
            if (!isOwner && !isAdmin) {
                return res.status(403).json({ error: "Not allowed to edit this post" });
            }

            // 3) Perform the update
            const query = `
                UPDATE blog_posts
                SET
                    title             = ?,
                    content           = ?,
                    content_summary   = ?,
                    thumbnailUrl      = ?,
                    thumbnailPublicId = ?,
                    imagesList        = ?,
                    last_modified     = CURRENT_TIMESTAMP
                WHERE post_id = ?`;
            const params = [
                postTitle,
                postContent,
                postSummary,
                thumbnailUrl,
                thumbnailPublicId,
                imagesList,
                blogPostId
            ];

            db.run(query, params, function (err2) {
                if (err2) return res.status(500).json({ error: "Failed to update post" });
                res.json({ success: true });
            });
        }
    );
});


// POST request to publish a blog post OLD EJS ROUTE FORMAT TEMPORARY
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

// POST request to publish a blog TOGGLE - NEW REACT FRONT END ROUTE
router.post("/api/toggle-publish-post", authenticateToken, toggleLimiter, async (req, res) => {
    const { blogPostId } = req.body;
    if (!blogPostId) return res.status(400).json({ error: "Missing blogPostId" });

    // Step 1: Check ownership
    const postOwnerQuery = `SELECT user_id FROM blog_posts WHERE post_id = ?`;
    db.get(postOwnerQuery, [blogPostId], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ error: "Post not found" });
        }

        const postUserId = row.user_id;

        // Step 2: Check permissions
        if (req.user.role === "guest" && postUserId !== 2) {
            return res.status(403).json({ error: "toggle-publish-post: Permission denied" });
        }

        // Step 3: Toggle publish
        const updateQuery = `
            UPDATE blog_posts
            SET isPublished = CASE isPublished WHEN 1 THEN 0 ELSE 1 END
            WHERE post_id = ?;
        `;
        db.run(updateQuery, [blogPostId], function (err) {
            if (err) {
                console.error("Toggle publish error:", err);
                return res.status(500).json({ error: "Failed to toggle publish state" });
            }
            res.json({ success: true, blogPostId, newState: "toggled" });
        });
    });
});


// POST request to togle the ShowOnHome flag
router.post("/api/toggle-show-on-home", authenticateToken, toggleLimiter, (req, res, next) => {
    const { blogPostId } = req.body;
    if (!blogPostId) return res.status(400).json({ error: "Missing blogPostId" });

    if (req.user.role === "guest") return res.status(403).json({ error: "toggle-show-on-home: Permission denied" });

    // Toggle logic: flips 0 -> 1 or 1 -> 0
    const query = `
        UPDATE blog_posts
        SET showOnHome = CASE showOnHome WHEN 1 THEN 0 ELSE 1 END
        WHERE post_id = ?;
    `;
    db.run(query, [blogPostId], function (err) {
        if (err) {
            console.error("Toggle error:", err);
            return res.status(500).json({ error: "Failed to toggle showOnHome" });
        }
        res.json({ success: true, blogPostId, newState: "toggled" });
    });
});

// POST request to DELETE a blog post
router.post("/api/delete-post", authenticateToken, deleteLimiter, (req, res, next) => {
    const { blogPostId } = req.body;

    // 1) Verify ownership (you already have this)
    db.get(
        `SELECT user_id FROM blog_posts WHERE post_id = ?`,
        [blogPostId],
        (err, row) => {
            if (err || !row) return res.status(404).json({ error: "Post not found" });
            if (req.user.role === "guest" && row.user_id !== 2) {
                return res.status(403).json({ error: "Permission denied" });
            }

            // 2) Delete the DB record
            db.run(
                "DELETE FROM blog_posts WHERE post_id = ?;",
                [blogPostId],
                err2 => {
                    if (err2) return res.status(500).json({ error: "Failed to delete post" });
                    // 3) Return JSON so front-end can update immediately
                    res.json({ success: true });
                }
            );
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