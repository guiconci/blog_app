
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Create your tables with SQL commands here (watch out for slight syntactical differences with SQLite vs MySQL)

CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS email_accounts (
    email_account_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_address TEXT NOT NULL,
    user_id  INTEGER, --the user that the email account belongs to
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE IF NOT EXISTS blog_settings (
    blog_settings_id INTEGER PRIMARY KEY AUTOINCREMENT,
    blog_name TEXT NOT NULL CHECK (length(blog_name)<40),
    blog_description TEXT NOT NULL CHECK (length(blog_name)<110),
    user_id  INTEGER, --the user that the blog settings belong to
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
-- Create table for blog posts (with foreign key to user) containing the attributes title, content, author, tags, likes, creation date, last modified, isPublished 	
CREATE TABLE IF NOT EXISTS blog_posts (
    post_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK (length(title)<55),
    content TEXT NOT NULL CHECK (length(content) < 100000) DEFAULT '',
    content_summary TEXT NOT NULL CHECK (length(content_summary)<220),
    thumbnailUrl TEXT NOT NULL,
    thumbnailPublicId TEXT DEFAULT '',
    imagesList TEXT DEFAULT '',
    likes INTEGER DEFAULT 0,
    isPublished INTEGER NOT NULL CHECK (isPublished IN (0, 1)) DEFAULT 0,
    showOnHome INTEGER NOT NULL CHECK (showOnHome IN (0, 1)) DEFAULT 0,
    last_modified TIMESTAMP,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id  INTEGER, --the user that the post belongs to
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create table for comments containing the content, commentor name, comment date, primary key as comment_id and foreign key to the post_id
CREATE TABLE IF NOT EXISTS comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL CHECK (length(content)<550),
    commenter_name TEXT NOT NULL CHECK (length(commenter_name)<40),
    comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    post_id  INTEGER, --the post that the comment belongs to
    FOREIGN KEY (post_id) REFERENCES blog_posts(post_id) ON DELETE CASCADE
);

-- Insert default data (if necessary here)

-- Set up users
INSERT INTO users ('user_name') VALUES ('Guilherme Conci');
INSERT INTO users ('user_name') VALUES ('Guest');
-- INSERT INTO users ('user_name') VALUES ('Simon Star');
-- INSERT INTO users ('user_name') VALUES ('Dianne Dean');
-- INSERT INTO users ('user_name') VALUES ('Harry Hilbert');
-- INSERT INTO users ('user_name') VALUES ('Ana Maria');



-- Give Simon two email addresses and Diane one, but Harry has none
INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('guilhermeconci@gmail.com', 1); 
-- INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('simon@hotmail.com', 1); 
-- INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('dianne@yahoo.co.uk', 2); 

-- Set up the default blog settings
INSERT INTO blog_settings ('blog_name', 'blog_description', 'user_id')
VALUES ('My Blog', 'Here you can learn something about me', 1);

-- Set up blog posts
INSERT INTO blog_posts (
    title, content, content_summary, thumbnailUrl, thumbnailPublicId, isPublished,
    showOnHome, last_modified, user_id, likes
)
VALUES 
('My first post', 'This is my first post', 'This is my first post summary',
'https://cdn-media-2.freecodecamp.org/w1280/5f9c9cad740569d1a4ca338e.jpg', '', 1, 1, CURRENT_TIMESTAMP, 1, 5),

('My second post', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum', 
'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
'https://cdn-media-2.freecodecamp.org/w1280/5f9c9cad740569d1a4ca338e.jpg', '', 1, 0, CURRENT_TIMESTAMP, 1, 2),

('My third post', 'This is my third post', 'This is my third post summary',
'https://cdn-media-2.freecodecamp.org/w1280/5f9c9cad740569d1a4ca338e.jpg', '', 1, 0, CURRENT_TIMESTAMP, 1, 10),

('My fourth post', 'This is my fourth post', 'This is my fourth post summary',
'https://cdn-media-2.freecodecamp.org/w1280/5f9c9cad740569d1a4ca338e.jpg', '', 0, 0, CURRENT_TIMESTAMP, 1, 0),

('My fifth post', 'This is my fifth post', 'This is my fifth post summary',
'https://cdn-media-2.freecodecamp.org/w1280/5f9c9cad740569d1a4ca338e.jpg', '', 0, 0, CURRENT_TIMESTAMP, 1, 0),

('My sixth post', 'This is my sixth post', 'This is my sixth post summary',
'https://cdn-media-2.freecodecamp.org/w1280/5f9c9cad740569d1a4ca338e.jpg', '', 0, 0, CURRENT_TIMESTAMP, 1, 0);


COMMIT;

