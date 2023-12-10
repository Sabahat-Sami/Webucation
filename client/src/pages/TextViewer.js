import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useCookies } from "react-cookie";
import axios from 'axios';

const TextEditor = () =>{
    const editorRef = useRef(null);
    const [title, setTitle] = useState("Untitled Document");
    const [access, setAccess] = useState("public");
    const [content, setContent] = useState("");
    const [cookies, removeCookie] = useCookies(['jwt']);
    const location = useLocation();
    const data = location.state
    useEffect(() => {
        axios.get('http://localhost:8080/document/get_document', {
            headers: {
                Authorization: `Bearer ${cookies.jwt}`,
                Document_id: data.document_id 
            }
        }).then((res) => {
            console.log(res)
            console.log(data.document_id)
            setTitle(res.data.title)
            setAccess(res.data.general_access)
            setContent(res.data.content)
        })
    }, [])





    return (
        <div className="font-bold">
            <br/><br/><br/>
            <div className="mt-[3%] rounded-full ml-[13%] mr-[10%]">
                <input className="text-3xl rounded-2xl bg-transparent px-4 py-2 w-[50%]" disabled required name="title" value={title} onChange= {e => {setTitle(e.target.value)}}/>
                <p className="text-xl ml-8 float-right mr-[6%]">Privacy: <select className="rounded-2xl text-base px-4 py-2 " disabled required defaultValue={access} onChange={e => {setAccess(e.target.value)}}>
                    <option>public</option>
                    <option>private</option>
                </select></p>
                <Editor
                disabled
                onInit={(evt, editor) => (editorRef.current = editor)}
                value={content}
                onEditorChange={() => (setContent(editorRef.current.getContent()))}
                init={{
                    height: 525,
                    width: "95%",
                    resize: true,
                    menubar: true,
                    margin: "auto",
                    menubar: true,
                    plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        // "export",
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
        </div>
        );

}

export default TextEditor