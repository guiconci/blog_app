import { useEffect, useState } from "react";
// import Header from "../components/Header";
import {
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  ClipboardIcon,
  DocumentIcon,
  PencilIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useImageUpload } from "../hooks/useImageUpload";

//Request to Del thumbnail from DB based on public ID
const delThumbnailFromDb = async (thumbnailUrl, thumbnailPublicId) => {
  if (thumbnailUrl.startsWith("https://res.cloudinary.com")) {
    try {
      const res = await fetch("http://localhost:3000/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: thumbnailPublicId }),
      });
      const data = await res.json();
      console.log("Deletion result:", data);
    } catch (err) {
      console.error("Failed to delete from Cloudinary", err);
    }
  }
};

const AuthorHome = () => {
  const [posts, setPosts] = useState([]);
  const [blogName, setBlogName] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const { delImagesFromDb } = useImageUpload();

  useEffect(() => {
    fetch("http://localhost:3000/api/author-home")
      .then(res => res.json())
      .then(data => {
        setPosts(data.blog_posts);
        setBlogName(data.blog_name);
        setBlogDescription(data.blog_description);
      })
      .catch(err => console.error("Failed to fetch author-home data:", err));
  }, []);

  const handlePermissionsFrontEnd = (userId) => {
    if (role === "guest" && userId !== 2) {
      alert("You can only edit posts created by Guest users.")
      return false;
    }
    return true;
  }

  const toggleShowOnHome = async (id) => {
    if (role === "guest") {
      window.alert("You can't do this as a guest.");
      return;
    }
    const res = await fetch("http://localhost:3000/api/toggle-show-on-home", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ blogPostId: id })
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error);
      return;
    }
    setPosts(prev => prev.map(p => p.post_id === id ? { ...p, showOnHome: p.showOnHome ? 0 : 1 } : p));
  };

  const togglePublish = async (postID, userId) => {
    // Checks if post belongs to current logged used.
    if (!handlePermissionsFrontEnd(userId)) return;
    const res = await fetch("http://localhost:3000/api/toggle-publish-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ blogPostId: postID, })
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Something went wrong");
      return;
    }
    setPosts(prev => prev.map(p => p.post_id === postID ? { ...p, isPublished: p.isPublished ? 0 : 1 } : p));
  };

  const deletePost = async (postId, userId) => {
    if (!handlePermissionsFrontEnd(userId)) return;
    const confirm = window.confirm("Are you sure you want to permanently delete this post? This action cannot be undone.");
    if (!confirm) return;

    const res = await fetch("http://localhost:3000/api/delete-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ blogPostId: postId })
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Something went wrong");
      return;
    }
    //Del Thumbnail from Cloudinary
    const post = posts.find(p => p.post_id === postId);
    if (post && post.thumbnailUrl && post.imagesList) {
      //Parse Images List
      let imgsListParsed = [];
      if (typeof post.imagesList === "string") {
        try { imgsListParsed = JSON.parse(post.imagesList); }
        catch { imgsListParsed = []; }
      } else if (Array.isArray(post.imagesList)) {
        imgsListParsed = post.imagesList;
      }
      //Dell Images from Cloudinary as Post is deleted from DB.
      const toDelete = [
        ...imgsListParsed,
        { url: post.thumbnailUrl, public_id: post.thumbnailPublicId }]
      if (toDelete.length > 0) {
        delImagesFromDb(toDelete);
      }
    }

    //Set new posts state to be shown
    setPosts(prev => prev.filter(p => p.post_id !== postId));
  };

  const handleEdit = (postId, userId) => {
    if (!handlePermissionsFrontEnd(userId)) return;
    navigate(`/edit-post/${postId}`);
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4 bg-background-light dark:bg-background-dark shadow rounded">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{blogName}</h1>
        <p>{blogDescription}</p>
      </div>

      <div className="mb-6">
        <a href="/new">
          <button className="click-allowed flex items-center gap-2">
            <PlusIcon className="w-5 h-5 shrink-0" /> Add New Post
          </button>
        </a>
      </div>

      {/* DRAFT POSTS */}
      <section className="mb-10">
        <div className="flex items-center mb-4 gap-2">
          <DocumentIcon className="w-5 h-5 shrink-0" />
          <h2 className="text-xl font-semibold">Drafts</h2>
        </div>
        <div className="space-y-4">
          {posts.filter(p => !p.isPublished).map(post => (
            <div key={post.post_id} className="p-4 border rounded shadow-sm bg-background-subtle dark:bg-background-subtleDark">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-sm">By {post.user_name}</p>
                  <p className="text-xs">Created: {post.creation_date} | Last Modified: {post.last_modified}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button onClick={() => togglePublish(post.post_id, post.user_id)} className="click-allowed flex items-center gap-1">
                    <EyeIcon className="w-5 h-5 shrink-0" /> Publish
                  </button>
                  <button
                    onClick={() => handleEdit(post.post_id, post.user_id)}
                    className="click-allowed flex items-center gap-1"
                  >
                    <PencilIcon className="w-5 h-5 shrink-0" /> Edit
                  </button>
                  <button
                    onClick={() => deletePost(post.post_id, post.user_id)}
                    className="click-danger flex items-center gap-1 underline-offset-2 hover:underline"
                  >
                    <TrashIcon className="w-5 h-5 shrink-0" /> Delete
                  </button>
                </div>
              </div>
              <p className="text-xs text-textSubtle-light mt-1">Unpublished posts are only visible in editor view.</p>
            </div>
          ))}
        </div>
      </section>

      {/* PUBLISHED POSTS */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <PencilIcon className="w-5 h-5 shrink-0" />
          <h2 className="text-xl font-semibold">Posts</h2>
        </div>
        <div className="space-y-4">
          {posts.filter(p => p.isPublished).map(post => (
            <div key={post.post_id} className="p-4 border rounded shadow-sm bg-background-subtle dark:bg-background-subtleDark">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-sm">By {post.user_name}</p>
                  <p className="text-xs">Created: {post.creation_date} | Last Modified: {post.last_modified}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button onClick={() => toggleShowOnHome(post.post_id)} className="click-allowed flex items-center gap-1">
                    {post.showOnHome ? <EyeIcon className="w-5 h-5 shrink-0" /> : <EyeSlashIcon className="w-5 h-5 shrink-0" />}
                    {post.showOnHome ? "On Home" : "Show on Home"}
                  </button>
                  <button onClick={() => togglePublish(post.post_id, post.user_id)} className="click-allowed flex items-center gap-1">
                    <EyeSlashIcon className="w-5 h-5 shrink-0" /> Unpublish
                  </button>
                  <button
                    className="click-allowed flex items-center gap-1"
                    onClick={() => {
                      navigator.clipboard.writeText(`http://localhost:3000/reader-article?blogPostId=${post.post_id}`);
                      alert("Link copied to clipboard");
                    }}>
                    <ClipboardIcon className="w-5 h-5 shrink-0" /> Copy Link
                  </button>
                  <button
                    onClick={() => handleEdit(post.post_id, post.user_id)}
                    className="click-allowed flex items-center gap-1"
                  >
                    <PencilIcon className="w-5 h-5 shrink-0" /> Edit
                  </button>
                  <button
                    onClick={() => deletePost(post.post_id, post.user_id)}
                    className="click-danger flex items-center gap-1 underline-offset-2 hover:underline"
                  >
                    <TrashIcon className="w-5 h-5 shrink-0" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AuthorHome;
