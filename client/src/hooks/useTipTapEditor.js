import { useEditor } from "@tiptap/react";
import { useState, useEffect, useCallback } from "react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Iframe from "../components/extensions/Iframe";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Link from '@tiptap/extension-link'

import 'highlight.js/styles/atom-one-dark.css'
import { createLowlight, all } from 'lowlight'
// import js from 'highlight.js/lib/languages/javascript'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
const lowlight = createLowlight(all)




// Setting up Image Extension
const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: null,
                parseHTML: (element) => element.getAttribute("width"),
                renderHTML: (attributes) => {
                    if (!attributes.width) return {};
                    return {
                        width: attributes.width,
                    };
                },
            },
            alt: {
                default: null,
                renderHTML: attributes => {
                    return attributes.alt ? { alt: attributes.alt } : {};
                },
            },
            style: {
                default: null,
                parseHTML: (element) => element.getAttribute("style"),
                renderHTML: (attributes) => (attributes.style ? { style: attributes.style } : {}),
            },
        };
    },
});

// Set Up Editor
export function useTiptapEditor(initialContent, initialImages = []) {
    const [uploadedImages, setUploadedImages] = useState(initialImages); // [{ url, public_id }]

    useEffect(() => {
        setUploadedImages(initialImages);
    }, [initialImages]);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                paragraph: {
                    HTMLAttributes: {
                    },
                    heading: false,
                },
            }),
            CustomImage,
            TextAlign.configure({
                types: ["heading", "paragraph"],
                defaultAlignment: 'left',
            }),
            Heading.configure({
                levels: [1, 2, 3],
            }),
            Iframe,
            Underline,
            CodeBlockLowlight.configure({ lowlight }),
            HorizontalRule,
            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
            }),
        ],
        content: initialContent,
    });

    const insertImage = useCallback((url, public_id) => {
        if (!editor?.commands) return;
        editor.chain().focus().setImage({ src: url, width: 750, style: "border-radius: 5px; display: block; margin: 8px auto;" }).run();
        if (public_id) setUploadedImages(prev => [...prev, { url, public_id }]); //only add to array, images with public id meaning they were uploded.
    }, [editor]);

    const getUsedImages = () => {
        const html = editor?.getHTML() || "";
        return uploadedImages.filter(img => html.includes(img.url));
    };

    const getUnusedImages = () => {
        const html = editor?.getHTML() || "";
        const unused = uploadedImages.filter(img => !html.includes(img.url));
        return unused;
    };



    return {
        editor,
        uploadedImages,
        insertImage,
        getUsedImages,
        getUnusedImages,
    };
};
