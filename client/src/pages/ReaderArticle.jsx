import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import hljs from 'highlight.js';
import { all } from 'lowlight'
// import 'highlight.js/styles/github.css';
import 'highlight.js/styles/atom-one-dark.css'
const API = process.env.REACT_APP_API_URL;

const ReaderArticle = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const contentRef = useRef();

  useEffect(() => {
    fetch(`${API}/api/reader-article?blogPostId=${id}`)
      .then(res => res.json())
      .then(data => setPost(data.blog_post))
      .catch(err => console.error("Failed to load post:", err));
  }, [id]);

  useEffect(() => {
    if (!post) return;              // 2️⃣ guard
    const codes = contentRef.current.querySelectorAll('pre code');
    codes.forEach(block => hljs.highlightElement(block));
  }, [post?.content]);               // 3️⃣ only after post.content is set


  if (!post) return (
    <div className="min-h-screen bg-background-subtle dark:bg-background-subtleDark text-textMain-light dark:text-textMain-dark">
      {/* <Header /> */}
      <div className="max-w-screen-lg mx-auto p-6">
        <p>Loading article...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-subtle dark:bg-background-subtleDark text-textMain-light dark:text-textMain-dark">
      {/* <Header /> */}
      <div className="max-w-screen-lg mx-auto p-6 bg-background-light dark:bg-background-dark shadow rounded">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          By {post.user_name} • Last updated: {post.last_modified}
        </p>
        <div
          ref={contentRef}
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
};

export default ReaderArticle;
