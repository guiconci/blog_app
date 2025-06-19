import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";


import TiptapEditor from "../components/TiptapEditor";
import { useUnsavedChanges } from "../context/unsavedChangesContext";
import { usePrompt } from "../hooks/usePrompt";
import { useImageUpload } from "../hooks/useImageUpload";
import { LinkIcon, ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

// Replaced by the logic to add unused thumbnails to unused images list abd batch deletion in Backend.
// const delThumbnailFromDb = async (thumbnailUrl, thumbnailPublicId) => {
//     if (thumbnailUrl.startsWith("https://res.cloudinary.com")) {
//         try {
//             const res = await fetch("http://localhost:3000/api/delete-image", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ public_id: thumbnailPublicId }),
//             });
//             const data = await res.json();
//             console.log("Deletion result:", data);
//         } catch (err) {
//             console.error("Failed to delete from Cloudinary", err);
//         }
//     }
// };

// const delImagesFromDb = async (images) => {
//     if (images.length === 0) return console.log('delImagesFromDb: unused imgs = 0 no API call needed');
//     try {
//         const res = await fetch("http://localhost:3000/api/delete-images", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ images }),
//         });
//         const data = await res.json();
//         console.log("Deletion result:", data);
//     } catch (err) {
//         console.error("Failed to delete from Cloudinary", err);
//     }
// };

const createPostInDb = async (postData) => {
    try {
        await fetch("http://localhost:3000/api/create-post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(postData),
        });
    } catch (err) {
        console.error("Failed to Create Post error: ", err);
    }
};

const updatePostInDb = async (postData) => {
    try {
        await fetch("http://localhost:3000/api/update-post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(postData),
        });
    } catch (err) {
        console.error("Failed to Update Post error: ", err);
    }
};

const PostEditor = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(postId);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [thumbnailPublicId, setthumbnailPublicId] = useState("");
    const [thumbnailUploads, setThumbnailUploads] = useState([]);
    const removedThumbnailsRef = useRef([]);   // will hold public_ids to delete
    const [initialImages, setInitialImages] = useState([]);
    const [mode, setMode] = useState("url");
    const { hasChanges, setHasChanges } = useUnsavedChanges(); //Watches for inputs changes.

    const thumbUrlInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const editorRef = useRef(null);
    const imageListRef = useRef([]);
    const getUnusedImagesRef = useRef(() => []);
    const getUsedImagesRef = useRef(() => []);


    useEffect(() => {
        if (isEditMode) {
            fetch(`http://localhost:3000/api/author-edit?blogPostId=${postId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    setTitle(data.title);
                    setDescription(data.content_summary);
                    setThumbnailUrl(data.thumbnailUrl);
                    setthumbnailPublicId(data.thumbnailPublicId);
                    let imgs = data.imagesList;
                    if (typeof imgs === "string") {
                        try { imgs = JSON.parse(imgs); }
                        catch (e) { imgs = []; }
                    }
                    setInitialImages(imgs);
                    setThumbnailUploads([
                        // include the “current” thumbnail so your deletion logic can track its predecessors
                        { url: data.thumbnailUrl, public_id: data.thumbnailPublicId }
                    ]);
                    // IMMEDIATELY sync images to editor refs
                    // imageListRef.current = imgs;
                    // getUsedImagesRef.current = () => data.imagesList;  
                    getUnusedImagesRef.current = () => [];
                    setTimeout(() => {
                        editorRef.current?.commands.setContent(data.content);
                    }, 0);
                })
                .catch(err => console.error("Post Editor/UseEffect: Failed to fetch post for editing", err));
        }
    }, [isEditMode, postId]);

    // Blocks user leaving page if editor fields were changed.
    usePrompt("You have unsaved changes. Are you sure you want to leave this page?", hasChanges);



    const onInsertThumbnail = (src, publicId) => {
        //if there’s already a thumbnailPublicId in state, queue it for deletion
        if (thumbnailPublicId) {
            removedThumbnailsRef.current.push({ url: thumbnailUrl, public_id: thumbnailPublicId });
        }
        setThumbnailUrl(src);
        setthumbnailPublicId(publicId);
        setHasChanges(true);

        // track this new upload
        setThumbnailUploads(prev => [...prev, { url: src, public_id: publicId }]);
    };

    const onRemoveThumbnail = () => {
        //Add to deletion list if has public ID on remove
        if (thumbnailPublicId) {
            removedThumbnailsRef.current.push({ url: thumbnailUrl, public_id: thumbnailPublicId });
        }
        setThumbnailUrl("");
        setthumbnailPublicId("");
        setFile(null);
        setUrl("");
        setHasChanges(true);
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    const {
        file, setFile,
        url, setUrl,
        isUploading,
        uploadFile,
        insertFromUrl,
        delImagesFromDb,
    } = useImageUpload((uploadedUrl, returnedId) => {
        // Update thumbnailUrl state
        onInsertThumbnail(uploadedUrl, returnedId);
        // Track uploaded thumbnail
        setThumbnailUploads(prev => [...prev, { url: uploadedUrl, public_id: returnedId }]);
    });

    //Handles thumbnail insertion with Existing Image from the web URL.
    const handleInsertThumbUrl = () => {
        if (thumbUrlInputRef.current?.checkValidity()) {
            insertFromUrl();
            setHasChanges(true);
        } else {
            thumbUrlInputRef.current?.reportValidity();
        }
    };
    //Handles Uploaded thumbnails list for Cloudinary Clean Up.
    // const handleThumbnailsDelList = () => {
    //     const thumbsToDelete = thumbnailUploads.slice(0, -1);
    //     // 1) only consider uploads that actually made it to Cloudinary
    //     const withPid = thumbsToDelete.filter(img => img.public_id);
    //     // 2) if there’s 0 or 1 valid thumbnails, nothing to delete
    //     if (withPid.length <= 1) return [];
    //     // 3) delete everything except the last (current) one
    //     // return withPid.slice(0, -1);
    //     return withPid;
    // };


    //Function to run at Save or Update post button at the end of the page.
    const handleSaveOrUpdate = async () => {
        if (!thumbnailUrl) {
            window.alert("You must insert a Thumbnail image.");
            return;
        }

        //Consolidade unused images for deletion.
        // const unusedThumbImages = handleThumbnailsDelList() || [];
        // const allUnusedImages = [...unusedContentImages, ...unusedThumbImages];
        // delImagesFromDb(allUnusedImages);
        // delete removed thumbnails + unused editor images
        const removedThumbs = removedThumbnailsRef.current;
        const unusedContentImages = getUnusedImagesRef.current() || [];
        const allForDeletion = [...unusedContentImages, ...removedThumbs];
        if (allForDeletion.length) {
            delImagesFromDb(allForDeletion);
        }

        //Gets current images to add to DB.
        const usedContentImages = getUsedImagesRef.current?.() || [];

        const postData = {
            postTitle: title,
            postContent: editorRef.current?.getHTML(),
            postSummary: description,
            authorId: (localStorage.getItem("role") === "admin" ? 1 : 2),
            thumbnailUrl: thumbnailUrl,
            thumbnailPublicId: thumbnailPublicId,
            imagesList: JSON.stringify(usedContentImages),
            ...(isEditMode && { blogPostId: postId }),
        };

        if (isEditMode) await updatePostInDb(postData);
        else await createPostInDb(postData);

        navigate("/author-home");
    };

    const handleCancel = () => {
        if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
            navigate("/author-home");
        }
    };

    return (
        <div className="min-h-screen bg-background-subtle dark:bg-background-subtleDark">
            {/* <Header /> */}
            <div className="max-w-screen-lg mx-auto p-4 bg-background-light dark:bg-background-dark shadow rounded">
                <h2 className="text-2xl font-semibold mb-4 text-textMain-light dark:text-textMain-dark">
                    {isEditMode ? "Edit Post" : "Create a New Post"}
                </h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveOrUpdate();
                    }}
                >
                    {/* Input Post Title */}
                    <label>
                        Post Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value); setHasChanges(true); }}
                        placeholder="Enter the title of your post"
                        required
                        maxLength={55} //Same as DB
                        className="w-full px-3 py-2 mb-6 border rounded text-textMain-light bg-background-light dark:text-textMain-dark dark:bg-background-dark"
                    />
                    {/* Input Post Description */}
                    <label>
                        Post Description
                    </label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Short summary of your post"
                        required
                        maxLength={220}
                        className="w-full px-3 py-2 mb-6 border rounded text-textMain-light bg-background-light dark:text-textMain-dark dark:bg-background-dark"
                    />

                    {/* Input Image Thumbnail */}
                    <label>
                        Image Thumbnail
                    </label>
                    <div className="space-y-2 mb-6">
                        {/* Segmented tabs */}
                        <div className="inline-flex p-1 bg-gray-200 dark:bg-zinc-800 rounded-xl">
                            {["url", "file"].map((type) => (
                                <button
                                    type="button"
                                    key={type}
                                    onClick={() => {
                                        setMode(type);
                                        if (type !== mode) {
                                            if (file) setFile(null); // clears file variable state
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = null; // clears file input element completely
                                            }
                                        }
                                    }}
                                    disabled={thumbnailUrl}
                                    className={`px-4 py-1 text-sm rounded-lg transition-colors duration-200
                                ${mode === type && !thumbnailUrl
                                            ? "bg-highlight2-light dark:bg-highlight2-dark text-white"
                                            : "text-gray-700 dark:text-gray-300"}
                                
                                ${mode === type && thumbnailUrl
                                            ? "text-gray-700 dark:text-gray-300 bg-buttonDisabled-light dark:bg-buttonDisabled-dark"
                                            : ""}`}
                                >
                                    {type === "url" ? "Paste URL" : "Upload File"}
                                </button>
                            ))}
                        </div>

                        {/* Conditional input */}
                        {mode === "url" && !thumbnailUrl ? (
                            // Shows url text input
                            <input
                                type="url"
                                ref={thumbUrlInputRef}
                                key="url-input"
                                value={url ?? ""}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-3 py-2 mb-1 border rounded text-textMain-light bg-background-light dark:text-textMain-dark dark:bg-background-dark"
                            />
                        ) : mode === "file" && !thumbnailUrl ? (
                            // Shows file picker input
                            <input
                                type="file"
                                key="file-input"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files[0])}
                                onClick={(e) => { e.target.value = ""; setFile(null); }} //Every time file upload window opens value and file are cleared.
                                className="block mb-1 text-sm rounded bg-highlight1-light text-textMain-light dark:text-textMain-dark dark:bg-highlight1-dark"
                            />
                        ) : (
                            // Shows image if thubnail already uploaded
                            <img alt="Project or Post Thumbnail" src={thumbnailUrl} width={300} className="rounded" />
                        )}
                        {/* Dynamic button for set thumbnail based on input type OR REMOVE if already set*/}
                        <button
                            type="button"
                            onClick={
                                () => {
                                    if (mode === "url" && !thumbnailUrl) handleInsertThumbUrl();
                                    else if (thumbnailUrl) { onRemoveThumbnail(); }
                                    else uploadFile();
                                }
                            }
                            disabled={(mode === "url" && (!url.trim() && !thumbnailUrl)) || //disables if mode=url and field empty
                                (mode === "file" && (!file && !thumbnailUrl)) || //disables if mode=file and (file and thumbURL empty)
                                isUploading} //disables if isuploading is true
                            className={(mode === "url" && (!url.trim() && !thumbnailUrl)) || (mode === "file" && (!file && !thumbnailUrl))
                                ? "click-not-allowed mb-6"
                                : "click-allowed mb-6"
                            }
                        >
                            {/* Conditional setting button label and icon */}
                            {/* Set Upload and Url labels */}
                            {thumbnailUrl ? (
                                <>
                                    <XMarkIcon className="w-5 h-5" />
                                    Remove Thumbnail
                                </>
                            ) : mode === "url" ? (
                                <>
                                    <LinkIcon className="w-5 h-5" />
                                    Insert from URL
                                </>
                            ) : isUploading ? (
                                <>
                                    <span className="w-3 h-3 mr-1 bg-white textMain-dark rounded-full animate-ping" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <ArrowUpTrayIcon className="w-5 h-5" />
                                    Upload File
                                </>
                            )
                            }

                        </button>
                    </div>
                    {/* Rich Text Editor Tiptap */}
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Post (Rich Text Editor)
                    </label>
                    <TiptapEditor
                        initialImages={initialImages}
                        onEditorReady={({ editor }) => {
                            editorRef.current = editor;
                        }}
                        onImagesUpdate={(images, getUnusedImages, getUsedImages) => {
                            imageListRef.current = images;
                            getUnusedImagesRef.current = getUnusedImages;
                            getUsedImagesRef.current = getUsedImages;

                        }}
                    />
                    <div className="flex gap-4 mt-4">
                        <button type="submit" className="click-allowed">
                            {isEditMode ? "Update Post" : "Save Post"}
                        </button>
                        <button type="button" onClick={handleCancel} className="click-danger text-textMain-light dark:text-textMain-dark">
                            Cancel
                        </button>
                        <button type="button" className="click-allowed"
                            onClick={() => {
                                console.log("Unused:", getUnusedImagesRef.current?.());
                                console.log("Used:", getUsedImagesRef.current?.());
                                console.log("Thumbs:", thumbnailUploads);

                            }}
                        >
                            TEST IMAG MANAGEMENT</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostEditor;
