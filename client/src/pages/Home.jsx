import Header from "../components/Header";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const API = process.env.REACT_APP_API_URL;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [blogName, setBlogName] = useState("");
  const [blogDescription, setBlogDescription] = useState("");

  useEffect(() => {
    fetch(`${API}/api/author-home`)
      .then((res) => res.json())
      .then((data) => {
        setBlogName(data.blog_name);
        setBlogDescription(data.blog_description);
        const filtered = data.blog_posts.filter(
          (p) => p.isPublished === 1 && p.showOnHome === 1
        );
        setPosts(filtered);
      })
      .catch((err) => console.error("Failed to load homepage data:", err));
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-textMain-light dark:text-textMain-dark">
      {/* <Header /> */}
      <main className="p-6 max-w-screen-lg mx-auto">
        <section className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 animate-fade-in-up">
            Hi, I'm Guilherme Conci
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 animate-fade-in-up delay-150">
            A developer and problem-solver with a background in materials science, now building clean, scalable web tools with React, Node.js, and SQLite. This is my portfolio — where code meets purpose.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Projects</h2>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, index) => (
              <Link
                to={`/reader-article/${post.post_id}`}
                key={post.post_id}
                className="block rounded overflow-hidden shadow-lg dark:drop-shadow-lg dark:shadow-white/10 bg-background-subtle dark:bg-background-subtleDark hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] animate-fade-in-up delay-[${index * 75}ms]"
              >
                {post.thumbnailUrl && (
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {post.content_summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <footer className="border-t pt-6 mt-10 text-sm text-gray-600 dark:text-gray-400 text-center">
          <p>&copy; {new Date().getFullYear()} Built with 💻 by Guilherme Conci</p>
          <p className="mt-1">Stay tuned — more posts and insights coming soon.</p>
        </footer>
      </main>
    </div>
  );
};

export default Home;
