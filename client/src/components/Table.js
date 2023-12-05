import { React, useState, useEffect, useRef } from 'react'
import Loading from '../components/Loading.js'
import { useCookies } from 'react-cookie';
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import {
  DeleteOutline,
} from "@material-ui/icons";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import styled from "styled-components";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: '65%'
  },
}));
const Icon = styled.div`
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  transition: all 0.5s ease;
  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`;
export default function Table() {
  const [searchTerm, setSearchTerm] = useState('')
  const [cookies, removeCookie] = useCookies(['jwt']);
  const navigate = useNavigate()
  const { noteType, courseID } = useParams();
  const [docs, setDocs] = useState([]);
  // const [categories, setCategories] = useState({});
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState();
  const [fileContent, setFileContent] = useState('');
  const [openShare, setOpenShare] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareID, setShareID] = useState('');
  const [sharedUsers, setSharedUsers] = useState([]);
  const modalRef = useRef();
  const classes = useStyles();

    useEffect(() => {
      let isMounted = true;

      const fetchDocuments = async () => {
        let path = "";
        let options = {};

        switch(noteType) {
          case "my-notes":
            path = 'http://localhost:8080/user/get_course_documents';
            options = {
              headers: {
                Authorization: `Bearer ${cookies.jwt}`,
                course_id: `${courseID}`
              },
            }
            break;
          case "shared":
            path = "http://localhost:8080/user/get_shared_with_me_documents/"
            options = {
              headers: {
                Authorization: `Bearer ${cookies.jwt}`,
              },
            }
            break;
          case "public":
            path = "http://localhost:8080/document/get_public_documents"
            options = {
              headers: {
                Authorization: `Bearer ${cookies.jwt}`,
              },
            }
            break;
          default:
            navigate("/")
        }

        try {
          const res = await axios.get(path, options);
  
          if (isMounted && res.status === 200) {
            Object.values(res.data).forEach(value => {
              // fetchCategories(value.document_id);
              setDocs(prev => [...prev, value]);
            });
            setLoading(false);
          }
        } catch (err) {
          console.log(err);
          removeCookie('jwt');
          navigate('/login');
        }
      };

      // const fetchCategories = async (id) => {
      //   try {
      //     const res = await axios.get('http://localhost:8080/document/get_document_category', {
      //       headers: {
      //         Authorization: `Bearer ${cookies.jwt}`,
      //         document_id: `${id}`
      //       },
      //     });
  
      //     if (res.status === 200) {
      //       setCategories(prev => {
      //           return {...prev, [id]: Object.values(res.data).map(item => item.name)}
      //         }
      //       );
      //     }
      //   } catch (err) {
      //     console.log(err);
      //   }
      // };

      const fetchCourse = async () => {
        try {
          const res = await axios.get('http://localhost:8080/course/get_course', {
            headers: {
              Authorization: `Bearer ${cookies.jwt}`,
              course_id: `${courseID}`
            },
          });
  
          if (res.status === 200) {
            setCourse(res.data[0]);
            setLoading(false);
          }
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      };
  
      if (cookies.jwt && cookies.jwt !== 'undefined') {
        setDocs([]);
        fetchDocuments();
        if (noteType === 'my-notes' && courseID) {
          setLoading(true);
          fetchCourse();
        }
      } else {
        navigate('/login');
      }

      return () => {
        isMounted = false;
      };
    }, [cookies, navigate]);

    // useEffect(() => {
    //   console.log(categories);
    // }, [categories]);

  const getSharedUsers = async (id) => {
    try {
      const res = await axios.get('http://localhost:8080/document/get_permitted_users', {
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
          document_id: `${id}`
        },
      }
      ).then(res => {
        if (res.status === 200 ) {
          Object.values(res.data).map(value => {
            setSharedUsers(prev => [...prev, value]);
          });
        }
        //console.log(res)
      });
    } catch (err) {
      //window.location.reload(false);
      console.log(err)
    }
  };

  const deleteSharedUser = async (id) => {
    try{
      axios.delete('http://localhost:8080/document/delete_permitted_user', {
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
          user_id: `${id}`,
          document_id: `${shareID}`
        }
      }).then((res) => {
        if(res.status === 200){
          setSharedUsers([]);
          getSharedUsers(id);
        }
      }).catch(err => console.log(err))
    }
    catch (e){
      console.log(e);
    }
  };

  const handleOpen = (id) => {
    setSharedUsers([]);
    getSharedUsers(id);
    setShareID(id);
    setOpenShare(true);
  };
  
  const handleClose = () => {
    setOpenShare(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    const addPermission = async () => {
      try {
        const res = await axios.post('http://localhost:8080/document/create_permitted_users', {
          document_id: `${shareID}`,
          email: `${shareEmail}`
        }, {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        }
        ).then(res => {
          if (res.status === 200 ) {
            setSharedUsers([]);
            getSharedUsers(shareID);
          }
          //console.log(res)
        });
      } catch (err) {
        //window.location.reload(false);
        console.log(err)
      }
    };
    addPermission();
  }

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  }
  
  const uploadFile = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    console.log(file);
    reader.onload = () => {
      setFileContent(reader.result)
      try{
        axios.post('http://localhost:8080/document/create_document', {
          title: file.name,
          general_access: 1,
          author_id: cookies.user_id,
          // size: file.size,
          content: reader.result,
          course_id: courseID
      }, {
          headers: {
              Authorization: `Bearer ${cookies.jwt}`,
          }
      }).then(res => {
          if (res.status === 200 ) {
            window.location.reload(false);
          }
      }).catch(err => console.log(err))
  }
    catch (e){
      console.log(e);
    }
    };
    reader.readAsBinaryString(file);
  }

  const deleteDocument = async (course_id, document_id) => {
    try{
      axios.delete('http://localhost:8080/document/delete_document', {
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
          Document_id: document_id,
          Course_id: course_id
        }
      }).then((res) => {
        if(res.status === 200){
          console.log("success")
          window.location.reload(false);
        }
      }).catch(err => console.log(err))
    }
    catch (e){
      console.log(e);
    }
  }
  return (
    <>
    {(loading) ? <Loading /> : (<div className='bg-white'>
      <br/><br/><br/>
      <div className='flex mt-12 w-full px-3'>
      <a
        href={(noteType === "my-notes") ? '/courses' : "/"}
        className='border-none bg-transparent text-[#424B5A] font-bold mr-4'
      >
        <button className='px-8 py-3 bg-[#424B5A] text-white rounded-2xl hover:bg-slate-400'>
          Back
        </button>
      </a>
        <div className='flex justify-between items-center w-full h-full'>
          <div>
            <h1 className='text-3xl text-[#424B5A]'>
              
              {(noteType === "my-notes") ? (
                course.code + ": " + course.title) : 
              (noteType === "shared") ? ("Notes Shared With Me") :
              ("Public Notes")
              }
              
              </h1>
          </div>
          <div className='flex border-2 rounded-3xl text-[#424B5A]'>
            <button className='flex items-center justify-center px-4 border-r '>
              <svg
                className='w-6 h-6 text-gray-600'
                fill='currentColor'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
              >
                <path d='M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z'></path>
              </svg>
            </button>
            <input
              type='text'
              className='px-4 py-2 w-80 rounded-3xl'
              placeholder='Search...'
              onChange={event => setSearchTerm(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className='mt-5'>
        <div className='border-b border-gray-200  '>
          <table className='table-auto w-full text-center'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-2 text-s text-gray-500'>Document Title</th>
                <th className='px-6 py-2 text-s text-gray-500'>Author</th>
                {(noteType === "my-notes") ? <></> : <th className='px-6 py-2 text-s text-gray-500'>Course</th>}
                {/* <th className='px-6 py-2 text-s text-gray-500'>Size</th> */}
                <th className='px-6 py-2 text-s text-gray-500'>Gen. Access</th>
                {/* <th className='px-6 py-2 text-s text-gray-500'>Categories</th> */}
                <th className='px-6 py-2 text-s text-gray-500'></th>
              </tr>
            </thead>

            <tbody className='bg-white table-auto'>

              {(noteType === "my-notes") ? (docs.map(note => (
                <tr className='hover:bg-slate-100' id={note.document_id}>
                  <div onClick={() => {navigate('/editNote', {state: {document_id: note.document_id}})}}>
                    <td className='hover:text-blue-500 hover:underline hover:font-bold px-6 py-4 text-sm text-gray-500'>
                      {note.title}
                    </td>
                    </div>
                  <td className='px-6 py-4'>{note.first_name + " " + note.last_name}</td>
                  {(noteType === "my-notes") ? <></> : <td className='px-6 py-4'>{note.course_code + ": " + note.course_title}</td>}
                  {/* <td className='px-6 py-4'>{note.size}</td> */}
                  {/* general access: 0 = private, 1 = public */}
                  <td className='px-6 py-4'>{(note.general_access === 0) ? "Private" : "Public"}</td>
                  {/* <td className='px-6 py-4'>
                    {categories[note.document_id]?.map(cat => (
                      <div>{cat}</div>
                    )
                    )}
                  </td> */}
                  <td className='flex justify-center'>
                    <Icon>
                      <PersonAddIcon onClick={() => {handleOpen(note.document_id)}}/>
                    </Icon>
                    <Icon>
                      <DeleteOutline onClick={() => {deleteDocument(courseID, note.document_id)}}/>
                    </Icon>
                  </td>
                </tr>))) : ((docs.map(note => (
                <tr className='hover:bg-slate-100' id={note.document_id}>
                  <div onClick={() => {navigate('/viewNote', {state: {document_id: note.document_id}})}}>
                    <td className='hover:text-blue-500 hover:underline hover:font-bold px-6 py-4 text-sm text-gray-500'>
                      {note.title}
                    </td>
                  </div>
                  <td className='px-6 py-4'>{note.first_name + " " + note.last_name}</td>
                  {(noteType === "my-notes") ? <></> : <td className='px-6 py-4'>{note.course_code + ": " + note.course_title}</td>}
                  {/* <td className='px-6 py-4'>{note.size}</td> */}
                  {/* general access: 0 = private, 1 = public */}
                  <td className='px-6 py-4'>{(note.general_access === 0) ? "Private" : "Public"}</td>
                  {/* <td className='px-6 py-4'>
                    {categories[note.document_id]?.map(cat => (
                      <div>{cat}</div>
                    )
                    )}
                  </td> */}
                </tr>))))
              }

            </tbody>
          </table>
        </div>
        {((noteType === "my-notes")) ?
        <>
        <button onClick={() => {navigate("/newNote", {state:{courseID: courseID}})}} className='text-white font-bold w-[50%] ml-[25%] mt-4 py-3 rounded-full shadow-xl bg-[#707FDD] hover:bg-indigo-800	'
        >+ New Document
        </button> 
        <form>
          <h1>React File Upload</h1>
          <input type="file" onChange={handleChange}/>
          <button type="submit" onClick={uploadFile}>Upload</button>
        </form></> : <></>
        }
        
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openShare}
        onClose={handleClose}
        closeAfterTransition
        ref={modalRef}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openShare}>
          <div className={classes.paper}>
            <h2 className="text-center text-2xl font-bold pb-8">Share Document</h2>
              <form className="flex flex-col justify-center items-center" onSubmit={e => handleSubmit(e)}>
                <div className='flex block border border-grey-light bg-white w-2/3 p-3 mb-4 rounded-3xl pl-5 shadow-xl'>
                  <input
                    required
                    type='text'
                    className='w-full p-3 ml-3 rounded-3xl pl-5'
                    placeholder='Email'
                    id='code'
                    onChange={e => {setShareEmail(e.target.value)}}
                    autocomplete="off"
                  />
                </div>
                <button
                  type='submit'
                  className='text-white bg-[#707FDD] w-1/2 text-center py-3 rounded-2xl  my-1 shadow-xl'
                >
                Submit
                </button>
              </form>
              <hr className='my-4'/>
              <h2 className="text-center text-2xl font-bold pb-8">Permitted Users</h2>
              <div className='max-h-40 overflow-y-scroll'>
              <table className='table-auto w-full text-center'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-2 text-s text-gray-500'>Email</th>
                    <th className='px-6 py-2 text-s text-gray-500'>Name</th>
                    <th className='px-6 py-2 text-s text-gray-500'></th>
                  </tr>
                </thead>
                <tbody>
                  {sharedUsers.map(user => (
                    <tr className='hover:bg-slate-100' id={user.email}>
                    <td className='px-6 py-4'>{user.email}</td>
                    <td className='px-6 py-4'>{user.fname + " " + user.lname}</td>
                    <td className='flex justify-center'>
                      <Icon>
                        <DeleteOutline onClick={() => {deleteSharedUser(user.user_id)}}/>
                      </Icon>
                    </td>
                  </tr>
                  ))
                  }
                </tbody>
              </table>
              </div>
              

            </div>
          </Fade>
        </Modal>
    </div>)}
    </>
  )
}