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
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state

    useEffect(() => {
        if(data.hasOwnProperty("document_id")){
            axios.get('http://localhost:8080/document/get_document', {
                headers: {
                    Authorization: `Bearer ${cookies.jwt}`,
                    Document_id: data.document_id 
                }
            }).then((res) => {
                console.log(res)
                console.log(data.document_id)
                setIsEditing(true);
                setTitle(res.data.title)
                setAccess(res.data.general_access)
                setContent(res.data.content)
            })
        }
    }, [])
    console.log(data)
    console.log(content)
    const saveNote = async => {
        if(!isEditing){
            try {
                let access_int = 1
                if (access === "private") {
                    access_int = 0;
                }
                axios.post('http://localhost:8080/document/create_document', {
                    title: `${title}`,
                    general_access: access_int,
                    author_id: cookies.user_id,
                    // size: 0,
                    content: editorRef.current.getContent(),
                    course_id: data.courseID
                }, {
                    headers: {
                        Authorization: `Bearer ${cookies.jwt}`
                    }
                }).then(res => {
                    if (res.status === 200 ) {
                        navigate(-1)
                    }
                }).catch(err => console.log(err))
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            try {
                let access_int = 1
                if (access === "private") {
                    access_int = 0;
                }
                axios.put('http://localhost:8080/document/update_document/',
                {
                    title: `${title}`,
                    general_access: access_int,
                    content: editorRef.current.getContent(),
                },
                {
                    headers:{
                        Authorization: `Bearer ${cookies.jwt}`,
                        Document_id: data.document_id
                    }
                }).then((res) => {
                    if(res.status == 200){
                        console.log("updated sucessfully!");
                        navigate(-1);
                    }
                })
            }
            catch (e) {
                console.log(e)
            }
        }
    }

    return (
        <div className="font-bold ">
            <br/><br/><br/>
            <div className="mt-[3%] rounded-full ml-[13%] mr-[10%]">
                <input className="text-xl rounded-2xl px-4 py-2 mb-4 w-[50%]" required name="title" value={title} onChange= {e => {setTitle(e.target.value)}}/>
                <p className="text-xl ml-8 float-right mr-[6%]">Privacy: <select className="rounded-2xl text-base px-4 py-2 " required defaultValue={access} onChange={e => {setAccess(e.target.value)}}>
                    <option>public</option>
                    <option>private</option>
                </select></p>
                <Editor
                onInit={(evt, editor) => (editorRef.current = editor)}
                value={content}
                onEditorChange={() => (setContent(editorRef.current.getContent()))}
                init={{
                    height: 525,
                    width: "95%",
                    resize: true,
                    menubar: true,
                    margin: "auto",
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
            <button 
                className='text-white w-[50%] ml-[25%] mt-4 py-3 rounded-full shadow-xl bg-[#707FDD] hover:bg-indigo-800	' 
            onClick={saveNote}>Save Changes 
            </button>
        </div>
        );

}

export default TextEditor