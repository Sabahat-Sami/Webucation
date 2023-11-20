import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function App() {
    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            console.log("HERE")
            console.log(editorRef.current.getContent());
        }
    };
    return (
        <div className="font-bold ">
            <br/><br/><br/>
            <div className="mt-8 rounded-full ml-[8%]">
                <p className="text-2xl mb-4 ml-[40%] underline text-[#424B5A]">New Note</p>
                <Editor
                onInit={(evt, editor) => (editorRef.current = editor)}
                init={{
                    height: 550,
                    width:1200,
                    menubar: true,
                    plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "export",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "help",
                        "wordcount",
                    ],
                    toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "help | fullscreen",
                    content_style:
                        "body { font-family: 'Montserrat', sans-serif; font-size:14px }",
                }}
            /></div>
            <button 
                className='text-white w-[50%] ml-[25%] mt-4 py-3 rounded-full shadow-xl bg-[#707FDD] hover:bg-indigo-800	' 
            onClick={log}>Save Changes 
            </button>
        </div>
    );
}