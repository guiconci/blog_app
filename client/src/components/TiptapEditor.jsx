import { EditorContent } from "@tiptap/react";
import ImageInsertModal from "./ImageInsertModal";
import { useState, useEffect } from "react";
import { useTiptapEditor } from "../hooks/useTipTapEditor";

function convertToEmbedUrl(url) {
    try {
        const parsed = new URL(url);

        // Handle youtu.be short links
        if (parsed.hostname === "youtu.be") {
            return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
        }

        // Handle regular youtube.com links
        if (parsed.hostname.includes("youtube.com") && parsed.searchParams.get("v")) {
            const videoId = parsed.searchParams.get("v");
            return `https://www.youtube.com/embed/${videoId}`;
        }

        // Already embed link
        if (parsed.hostname === "www.youtube.com" && parsed.pathname.startsWith("/embed")) {
            return url;
        }

        return null; // not a recognized YouTube link
    } catch {
        return null;
    }
}

const TiptapEditor = ({ onEditorReady, onImagesUpdate, initialImages = [] }) => {
    const { editor,
        uploadedImages,
        insertImage,
        getUsedImages,
        getUnusedImages } = useTiptapEditor(null, initialImages);; //Set the editor hook

    const [showImgModal, setShowImgModal] = useState(false); //Show Modal State

    // Send editor + getUploadedImages to parent once ready
    useEffect(() => {
        if (onEditorReady && editor) {
            onEditorReady({ editor }); // <-- this sets the ref in parent
        }
    }, [editor]);

    // useEffect(() => {
    //     if (onImagesUpdate && editor) {
    //         // const html = editor.getHTML();
    //         // const unused = uploadedImages.filter(({ url }) => !html.includes(url));
    //         onImagesUpdate(uploadedImages, getUnusedImages, getUsedImages);
    //     }
    // }, [uploadedImages, editor]);
    useEffect(() => {
        if (onImagesUpdate && editor) {
            onImagesUpdate(uploadedImages, getUnusedImages, getUsedImages);
        }
    }, [uploadedImages, editor]);

    useEffect(() => {
        // Force run once when editor is ready with initialImages
        if (onImagesUpdate && editor && initialImages.length > 0) {
            onImagesUpdate(initialImages, () => [], () => initialImages);  // just set used
        }
    }, [editor, initialImages]);




    return (
        <div className="relative overflow-visible border mb-2 p-1 rounded bg-background-light dark:bg-background-dark text-textMain-light dark:text-textMain-dark">
            <div className="sticky top-8 p-1 border-b z-10 bg-background-light/90 dark:bg-background-dark/95 backdrop-blur shadow transition-all duration-300">
                <div className="flex flex-wrap gap-1 mb-1">
                    <button
                        type="button"
                        title="Bold"  // Tooltip text
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        className={`px-2 py-1 text-sm font-bold border rounded 
                        ${editor?.isActive('bold') ? 'bg-highlight1-light dark:bg-highlight1-dark' : ''}`}
                    >
                        B
                    </button>
                    <button
                        type="button"
                        title="Italic"  // Tooltip text
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        className={`px-2 py-1 text-sm italic border rounded 
                        ${editor?.isActive('italic') ? 'bg-highlight1-light dark:bg-highlight1-dark' : ''}`}
                    >
                        I
                    </button>
                    <button
                        type="button"
                        title="Underline"  // Tooltip text
                        onClick={() => editor?.chain().focus().toggleUnderline().run()}
                        className={`px-2 py-1 text-sm underline border rounded 
                        ${editor?.isActive('underline') ? 'bg-highlight1-light dark:bg-highlight1-dark' : ''}`}
                    >
                        U
                    </button>

                    {/* Heading buttons */}
                    <button
                        type="button"
                        title="Header 1"  // Tooltip text
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`text-sm px-2 py-1 border rounded 
                        ${editor?.isActive("heading", { level: 1 }) ? "bg-highlight1-light dark:bg-highlight1-dark text-white" : ""}`}
                    >
                        H1
                    </button>
                    <button
                        type="button"
                        title="Header 2"  // Tooltip text
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`text-sm px-2 py-1 border rounded 
                        ${editor?.isActive("heading", { level: 2 }) ? "bg-highlight1-light dark:bg-highlight1-dark text-white" : ""}`}
                    >
                        H2
                    </button>
                    <button
                        type="button"
                        title="Normal Text"  // Tooltip text
                        onClick={() => editor?.chain().focus().setParagraph().run()}
                        className={`text-sm px-2 py-1 border rounded 
                        ${editor?.isActive("paragraph") ? "bg-highlight1-light dark:bg-highlight1-dark text-white" : ""}`}
                    >
                        Normal
                    </button>

                    {/* Alignment buttons */}
                    {[
                        { icon: "←", align: "left", buttonTitle: "Text Left" },
                        { icon: "↔", align: "center", buttonTitle: "Text Center" },
                        { icon: "→", align: "right", buttonTitle: "Text Right" },
                        { icon: "≡", align: "justify", buttonTitle: "Text Justified" },
                    ].map(({ icon, align, buttonTitle }) => {
                        const selectionNode = editor?.state?.selection?.node;
                        const isImage = selectionNode?.type?.name === "image";
                        const imageStyle = selectionNode?.attrs?.style || "";
                        const isImageAligned = (alignment) => {
                            if (alignment === "left") return imageStyle.includes("margin: 0;");
                            if (alignment === "center") return imageStyle.includes("margin: 0 auto;");
                            if (alignment === "right") return imageStyle.includes("margin-left: auto");
                            return false;
                        };
                        return (
                            <button
                                type="button"
                                key={align}
                                title={buttonTitle}
                                onClick={() => {
                                    if (isImage) {
                                        const style =
                                            align === "left"
                                                ? "display: block; margin: 0;"
                                                : align === "center"
                                                    ? "display: block; margin: 0 auto;"
                                                    : align === "right"
                                                        ? "display: block; margin-left: auto; margin-right: 0;"
                                                        : "";
                                        editor.chain().focus().updateAttributes("image", { style }).run();
                                    } else {
                                        editor.chain().focus().setTextAlign(align).run();
                                    }
                                }}
                                className={`text-sm px-2 py-1 border rounded ${(!isImage && editor?.isActive({ textAlign: align })) ||
                                    (isImage && isImageAligned(align))
                                    ? "bg-highlight1-light dark:bg-highlight1-dark text-white"
                                    : ""
                                    }`}
                            >
                                {icon}
                            </button>
                        );
                    })}

                    {/* Other buttons */}
                    <button
                        type="button"
                        title="Insert Image"
                        onClick={() => setShowImgModal(true)}
                        className="px-2 py-1 border rounded"
                    >
                        Insert Image
                    </button>
                    <button
                        type="button"
                        title="Resize Image"
                        onClick={() => {
                            const pos = editor.state.selection.from;
                            const node = editor.state.doc.nodeAt(pos);
                            if (node?.type.name === "image") {
                                const newWidth = window.prompt("Enter new image width in px", "300");
                                if (newWidth) {
                                    editor.chain().focus().updateAttributes("image", { width: newWidth }).run();
                                }
                            } else {
                                alert("Select an image first.");
                            }
                        }}
                        className="px-2 py-1 border rounded"
                    >
                        Resize Image
                    </button>
                    <button
                        type="button"
                        title="Embed Video"
                        onClick={() => {
                            const input = window.prompt("Paste a YouTube URL:");
                            const embedUrl = convertToEmbedUrl(input);
                            if (embedUrl) {
                                editor?.chain().focus().insertContent({
                                    type: "iframe",
                                    attrs: { src: embedUrl },
                                }).run();
                            } else {
                                alert("Invalid YouTube URL.");
                            }
                        }}
                        className="px-2 py-1 text-sm border rounded"
                    >
                        Embed Video
                    </button>
                </div>

                <ImageInsertModal
                    isOpen={showImgModal}
                    onClose={() => setShowImgModal(false)}
                    onInsertImage={(url, public_id) => insertImage(url, public_id)}
                />
            </div>
            <div className="px-1 py-2">
                <EditorContent editor={editor} className="tiptap prose dark:prose-invert max-w-none" />
            </div>
        </div>
    );
};
export default TiptapEditor;