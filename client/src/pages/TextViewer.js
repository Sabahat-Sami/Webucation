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
        <div className="font-bold ">
            <br/><br/><br/>
            <div className="mt-8 rounded-full ml-[8%]">
                <input disabled required name="title" value={title} onChange= {e => {setTitle(e.target.value)}}/>
                <select disabled required defaultValue={access} onChange={e => {setAccess(e.target.value)}}>
                    <option>public</option>
                    <option>private</option>
                </select>
                <Editor
                disabled
                onInit={(evt, editor) => (editorRef.current = editor)}
                value={content}
                onEditorChange={() => (setContent(editorRef.current.getContent()))}
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