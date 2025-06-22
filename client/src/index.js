import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import App from "./App";
import Home from "./pages/Home";
import AuthorHome from "./pages/AuthorHome";
import PostEditor from "./pages/PostEditor";
import ReaderArticle from "./pages/ReaderArticle";
import Login from "./pages/Login"
import { UnsavedChangesProvider } from "./context/unsavedChangesContext";
import ScrollManager from "./components/ScrollManager";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UnsavedChangesProvider>
    <BrowserRouter>
    <ScrollManager />
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="author-home" element={<AuthorHome />} />
          <Route path="new" element={<PostEditor />} />
          <Route path="edit-post/:postId" element={<PostEditor />} />
          <Route path="reader-article/:id" element={<ReaderArticle />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </UnsavedChangesProvider>
);
