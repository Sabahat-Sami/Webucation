import { React, useState, useEffect } from 'react'
import Loading from '../components/Loading.js'
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function Table() {
  const [searchTerm, setSearchTerm] = useState('')
  const [cookies, removeCookie] = useCookies(['jwt']);
  const navigate = useNavigate()
  const { noteType, courseID } = useParams();
  const [docs, setDocs] = useState([]);
  const [categories, setCategories] = useState({});
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);

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
              fetchCategories(value.document_id);
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

      const fetchCategories = async (id) => {
        try {
          const res = await axios.get('http://localhost:8080/document/get_document_category', {
            headers: {
              Authorization: `Bearer ${cookies.jwt}`,
              document_id: `${id}`
            },
          });
  
          if (res.status === 200) {
            setCategories(prev => {
                return {...prev, [id]: Object.values(res.data).map(item => item.name)}
              }
            );
          }
        } catch (err) {
          console.log(err);
        }
      };

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

  return (
    <>
    {(loading) ? <Loading /> : (<div className='bg-white'>
      <br/><br/><br/>
      <div className='flex mt-12 w-full px-3'>
      <a
        href={(noteType === "my-notes") ? '/courses/my-courses' : "/"}
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
                <th className='px-6 py-2 text-s text-gray-500'>Size</th>
                <th className='px-6 py-2 text-s text-gray-500'>Gen. Access</th>
                <th className='px-6 py-2 text-s text-gray-500'>Categories</th>
              </tr>
            </thead>

            <tbody className='bg-white table-auto'>

              {docs.map(note => (
                <tr className='hover:bg-slate-100'>
                  <a href="" target="_blank" rel="noreferrer">
                    <td className='hover:text-blue-500 hover:underline hover:font-bold px-6 py-4 text-sm text-gray-500'>
                      {note.title}
                    </td>
                  </a> 
                  <td className='px-6 py-4'>{note.first_name + " " + note.last_name}</td>
                  {(noteType === "my-notes") ? <></> : <td className='px-6 py-4'>{note.course_code + ": " + note.course_title}</td>}
                  <td className='px-6 py-4'>{note.size}</td>
                  {/* general access: 0 = private, 1 = public */}
                  <td className='px-6 py-4'>{(note.general_access === 0) ? "Private" : "Public"}</td>
                  <td className='px-6 py-4'>
                    {categories[note.document_id]?.map(cat => (
                      <div>{cat}</div>
                    )
                    )}
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
        {((noteType === "my-notes")) ?
          <a href="/newNote" target="_blank"><button
          className='text-white font-bold w-[50%] ml-[25%] mt-4 py-3 rounded-full shadow-xl bg-[#707FDD] hover:bg-indigo-800	'
        >+ New Document
        </button></a> : <></>
        }
        
      </div>
    </div>)}
    </>
  )
}