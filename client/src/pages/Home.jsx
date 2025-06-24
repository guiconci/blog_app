// src/backend/pages/home
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
const API = process.env.REACT_APP_BACKEND_URL;

//SOCKET
const socket = io(process.env.REACT_APP_BACKEND_URL);

const Home = () => {
  const [posts, setPosts] = useState([]);

  //Fetches published posts at page load.
  useEffect(() => {
    fetch(`${API}/api/author-home`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.blog_posts.filter(
          (p) => p.isPublished === 1 && p.showOnHome === 1
        );
        setPosts(filtered);
      })
      .catch((err) => console.error("Failed to load homepage data:", err));
  }, []);

  //Fetches new posts on togling them to show on home, listens to socket.io.
  useEffect(() => {
    // listen for updates:
    socket.on("posts:update", updatedPosts => {
      const filtered = updatedPosts.filter(
        (p) => p.isPublished === 1 && p.showOnHome === 1
      );
      setPosts(filtered);
    });
    return () => {
      socket.off("posts:update");
    };
  }, []);

  //Checks screen width for dynamic content adjustment
  const [isWideScreen, setIsWideScreen] = useState(false);
  useEffect(() => {
    const checkWidth = () => setIsWideScreen(window.innerWidth >= 1000);
    checkWidth(); // Initial check
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-textMain-light dark:text-textMain-dark">
      {/* <Header /> */}
      <main className="p-6 max-w-screen-lg 2xl:max-w-screen-xl mx-auto">
        <section className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 animate-fade-in-up">
            Hi, I'm Guilherme Conci
          </h1>
          <p className="text-lg animate-fade-in-up">
            From factory floors to full-stack code, my work has always been about solving the right problems with the right tools.
            {isWideScreen ? <span className="block h-2" /> : <span> </span>} 
            This space is a collection of software experiments, systems, and ideas — built with care, and meant to be used.          
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Projects</h2>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 ">
            {posts.map((post, index) => (
              <Link
                to={`/reader-article/${post.post_id}`}
                key={post.post_id}
                className="block rounded overflow-hidden shadow-lg dark:drop-shadow-lg dark:shadow-white/10 bg-background-subtle dark:bg-background-subtleDark hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] animate-fade-in-up delay-[${index * 75}ms]"
              >
                {post.thumbnailUrl && (
                  <div className="w-full aspect-auto overflow-hidden">
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-sm">
                    {post.content_summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        {/* <footer className="border-t pt-6 mt-10 text-sm text-gray-600 dark:text-gray-400 text-center">
          <p>&copy; {new Date().getFullYear()} Built with 💻 by Guilherme Conci</p>
          <p className="mt-1">Stay tuned — more posts and insights coming soon.</p>
        </footer> */}
      </main>
    </div>
  );
};

export default Home;
