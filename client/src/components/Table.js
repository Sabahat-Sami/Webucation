import { React, useState, useEffect } from 'react'
import { notes } from '../pages/data'
import ch1 from "../pages/dummy/ch1.pdf"
import ch2 from "../pages/dummy/ch2.pdf"
import ch3 from "../pages/dummy/ch3.pdf"
import ch4 from "../pages/dummy/ch4.pdf"
import ch5 from "../pages/dummy/ch5.pdf"
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Table() {
  const [searchTerm, setSearchTerm] = useState('')
  const [cookies, removeCookie] = useCookies(['jwt']);
    const navigate = useNavigate()

    useEffect(() => {
      let isMounted = true;
  
      const fetchProfile = async () => {
        try {
          const res = await axios.get('http://localhost:8080/user/get_profile', {
            headers: {
              Authorization: `Bearer ${cookies.jwt}`,
            },
          });
  
          console.log(res);
  
          if (res.status === 200 && isMounted) {
            console.log('Success');
          }
        } catch (err) {
          console.log(err);
  
          if (isMounted) {
            removeCookie('jwt');
            navigate('/login');
            return;
          }
        }
      };
  
      if (cookies.jwt && cookies.jwt !== 'undefined') {
        fetchProfile();
      } else {
        navigate('/login');
      }
  
      return () => {
        isMounted = false;
      };
    }, [cookies, navigate]);

  return (
    <div className='bg-white'>
      <br/><br/><br/>
      <div className='flex mt-12 w-full px-3'>
        <div className='flex justify-between items-center w-full h-full'>
          <div>
            <h1 className='text-3xl text-[#424B5A]'>Notes</h1>
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
                <th className='px-6 py-2 text-s text-gray-500'>Size</th>
                <th className='px-6 py-2 text-s text-gray-500'>Gen. Access</th>
                <th className='px-6 py-2 text-s text-gray-500'>Categories</th>
              </tr>
            </thead>

            <tbody className='bg-white table-auto'>

              {notes.map(note => (
                <tr className='hover:bg-slate-100'>
                  <a href={note.link} target="_blank" rel="noreferrer">
                    <td className='hover:text-blue-500 hover:underline hover:font-bold px-6 py-4 text-sm text-gray-500'>
                      {note.title}
                    </td>
                  </a> 
                  <td className='px-6 py-4'>{note.author}</td>
                  <td className='px-6 py-4'>{note.size}</td>
                  <td className='px-6 py-4'>{note.gen_access}</td>
                  <td className='px-6 py-4'>{note.categories}</td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
        <a href="/newNote" target="_blank"><button
          className='text-white font-bold w-[50%] ml-[25%] mt-4 py-3 rounded-full shadow-xl bg-[#707FDD] hover:bg-indigo-800	'
        >+ New Document
        </button></a>
      </div>
    </div>
  )
}