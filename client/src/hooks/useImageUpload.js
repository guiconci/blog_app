import { useState } from "react";

export function useImageUpload(onInsert) {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");

  const uploadFile = async () => {
    if (!file || isUploading) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("http://localhost:3000/api/upload-image", {
        method: "POST",
        headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`},
        body: formData,
      });

      const data = await res.json();
      onInsert(data.url, data.public_id);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
      setFile(null);
    }
  };

  const insertFromUrl = () => {
    if (url) {
      const replacePublicId = "";
      onInsert(url, replacePublicId);
      setUrl("");
      setFile(null);
    }
  };


  const delImagesFromDb = async (images) => {
    if (images.length === 0) return console.log('delImagesFromDb: unused imgs = 0 no API call needed');
    try {
      const res = await fetch("http://localhost:3000/api/delete-images", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ images }),
      });
      const data = await res.json();
      console.log("Deletion result:", data);
    } catch (err) {
      console.error("Failed to delete from Cloudinary", err);
    }
  };

  return {
    file,
    setFile,
    url,
    setUrl,
    isUploading,
    uploadFile,
    insertFromUrl,
    delImagesFromDb,
  };
}
