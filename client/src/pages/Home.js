import React from 'react'
import Docs from './Docs'

const Home = () => {
  // should prob check for valid token here
  return (
    <div>
      <br/><br/><br/><br/>
      Temporary Home Page (Should have not signed in and signed in version)
      <br/>
      <a
        href='/courses/my-courses'
        className='border-none bg-transparent text-[#424B5A] font-bold mr-4'
      >
        <button className='px-8 py-3 bg-[#424B5A] text-white rounded-2xl hover:bg-slate-400'>
          My Courses
        </button>
      </a>
    </div>
  )
}

export default Home
