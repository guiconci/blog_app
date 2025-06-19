import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { PhotoIcon, LinkIcon, ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useImageUpload } from "../hooks/useImageUpload";


const ImageInsertModal = ({ isOpen, onClose, onInsertImage }) => {
    const imageUrlInputRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    // Wait until we’re on the client
    useEffect(() => {
        setMounted(true);
    }, []);

    const {
        file, setFile,
        url, setUrl,
        isUploading,
        uploadFile,
        insertFromUrl
    } = useImageUpload((uploadedUrl, uploadePublicId) => {
        onInsertImage(uploadedUrl, uploadePublicId); // Or setThumbnailUrl()
        onClose();
    });

    // if (!isOpen) return null;
    if (!isOpen || !mounted) return null;

    return createPortal(
        <div id="blur-bg-modal" className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div id="modal-box" className="bg-background-light dark:bg-background-dark p-6 rounded-xl shadow-xl dark:shadow-white/10 w-[320px] space-y-4 border border-highlight1-light dark:border-highlight1-dark">
                <div className="flex items-center gap-2 text-lg font-semibold text-textMain-light dark:text-textMain-dark">
                    <PhotoIcon className="w-6 h-6" />
                    Insert Image
                </div>

                <div className="space-y-3">
                    {/* URL Input */}
                    <input
                        type="url"
                        ref={imageUrlInputRef}
                        placeholder="Paste image URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full p-2 border rounded text-sm bg-white dark:bg-zinc-800 text-black dark:text-white"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            if (imageUrlInputRef.current?.checkValidity()) {
                                insertFromUrl();
                            } else {
                                imageUrlInputRef.current?.reportValidity()
                            }
                        }}
                        className="w-full py-2 rounded text-sm font-medium bg-highlight2-light dark:bg-highlight2-dark text-white hover:opacity-90 flex items-center justify-center gap-2"
                    >
                        <LinkIcon className="w-5 h-5" />
                        Insert from URL
                    </button>
                    {/* Image/File Input */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full text-sm text-textMain-light dark:text-textMain-dark"
                    />
                    <button
                        type="button"
                        onClick={uploadFile}
                        disabled={!file || isUploading}
                        className={
                            `${file && !isUploading
                                ? "click-allowed"
                                : "click-not-allowed"}`}
                    >
                        <ArrowUpTrayIcon className="w-5 h-5" />
                        {isUploading ? "Uploading..." : "Upload from PC"}
                    </button>

                </div>
                {/* Close/Cancel Button */}
                <button
                    type="button"
                    onClick={() => {
                        onClose();
                        setFile(null);
                        setUrl("");
                    }}
                    className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 hover:underline mt-2 mx-auto"
                >
                    <XMarkIcon className="w-4 h-4 mr-1" />
                    Cancel
                </button>
            </div>
        </div>,
        document.body
    );
};

export default ImageInsertModal;
