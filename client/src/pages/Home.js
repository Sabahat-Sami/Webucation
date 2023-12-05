import React from 'react'
import Docs from './Docs'
import { useCookies } from "react-cookie";
import { useState, useRef, useEffect } from 'react'
import axios from 'axios';

const Home = () => {

  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const [valid, setValid] = useState(false); // ^set `valid` when you check for valid token; logged in = true
  const [user, setUser] = useState(""); // set this to the user's first name


  useEffect(() => {
    if(cookies.jwt != undefined){
      try {
        axios.get('http://localhost:8080/user/get_profile/', {
            headers: {
                Authorization: `Bearer ${cookies.jwt}`
            }
        }).then(res => {
            if (res.status === 200 ) {
              console.log("LOGGED IN")
              setValid(true)
              setUser(res.data.fname)
            }
        }).catch(err => console.log(err))
      }
      catch (e) {
          console.log("THIS RAN")
          console.log(e);
      }
    }
  }, [])

  return (
    <div>
      <br/><br/><br/><br/>
      {valid ? (
        <>
          <br />
          <p className='text-center text-6xl underline mb-8'>Welcome {user}!</p>
          <p className='text-center text-3xl  mb-8'>What would you like to do?</p>
          <div className='ml-[32%] text-2xl space-y-4'>
            <a
              href='/courses'
              className='border-none bg-transparent text-[#424B5A] font-bold mr-4'
            >
              <button className='w-[50%] py-4 bg-[#424B5A] text-white rounded-full hover:bg-slate-400 hover:w-[55%] hover:py-5 hover:ml-[-2%]'>
                My Courses
              </button>
            </a><br />
            <a
              href='/notes/shared'
              className='border-none bg-transparent text-[#424B5A] font-bold mr-4'
            >
              <button className='mt-8 w-[50%] py-3 bg-[#424B5A] text-white rounded-full hover:bg-slate-400 hover:w-[55%] hover:py-5 hover:ml-[-2%]'>
                Shared Documents
              </button>
            </a><br />
            <a
              href='/notes/public'
              className='border-none bg-transparent text-[#424B5A] font-bold mr-4'
            >
              <button className='mt-8 w-[50%] py-3 bg-[#424B5A] text-white rounded-full hover:bg-slate-400 hover:w-[55%] hover:py-5 hover:ml-[-2%]'>
                Public Notes
              </button>
            </a>
            <a
              href='/profile'
              className='border-none bg-transparent text-[#424B5A] font-bold mr-4'
            >
              <button className='mt-8 w-[50%] py-3 bg-[#424B5A] text-white rounded-full hover:bg-slate-400 hover:w-[55%] hover:py-5 hover:ml-[-2%]'>
                My Account
              </button>
            </a>
            <a
              href='/network'
              className='border-none bg-transparent text-[#424B5A] font-bold mr-4'
            >
              <button className='mt-8 w-[50%] py-3 bg-[#424B5A] text-white rounded-full hover:bg-slate-400 hover:w-[55%] hover:py-5 hover:ml-[-2%]'>
                My Network
              </button>
            </a>
          </div>
        </>
      ) : (
        <>
          <div>
              <img className='max-w-[45%] rounded-full mr-32 float-right' src='https://assets-global.website-files.com/61a05ff14c09ecacc06eec05/61f5868b789816331ac6af01_5_Benefits_of_Online_Education.png'/>
              <p className='ml-[10%] mt-20 font-semibold text-5xl'>Collaborative and fun<br/>road to success<br/>in college </p>
              <p className='ml-[10%] mt-8 text-xl text-gray-400'>Store, share, and collaborate on notes, homework, and <br/>projects from your computer</p>
              <img className='max-w-[35%] rounded-full mt-8 ml-[10%] float-left' src='https://cdn.elearningindustry.com/wp-content/uploads/2022/01/shutterstock_525008128.jpg' />
              <div className='mt-4 float-right text-3xl'>  
                <a href='/login'>
                  <button className='px-8 ml-[10%] py-3 bg-transparent outline outline-offset-2 outline-1 outline-gray-400 text-xl text-[#a6aff8] rounded-xl hover:bg-gray-200 hover:underline'>Go to Home</button>
                </a> 
                <div className='mr-72'>
                  <p className='mt-4'>Don't have an account?</p>
                  <a href='/register'>
                    <button className='px-8 ml-12 mt-4 py-3 bg-[#a6aff8] text-xl text-white rounded-xl hover:bg-blue-800 hover:underline'>Try Webucation</button>
                  </a> 
                </div>
              </div>
          </div>
        </>
      )}
        
    </div>
  )
}

export default Home
