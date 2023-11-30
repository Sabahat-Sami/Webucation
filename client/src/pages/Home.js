import React from 'react'
import Docs from './Docs'

const Home = () => {
                      // should prob check for valid token here
  const valid = false; // ^set `valid` when you check for valid token; logged in = true

  return (
    <div>
      <br/><br/><br/><br/>
      {valid ? (
        <>
          <br />
          <a
            href='/courses'
            className='border-none bg-transparent text-[#424B5A] font-bold mr-4'
          >
            <button className='px-8 py-3 bg-[#424B5A] text-white rounded-2xl hover:bg-slate-400'>
              My Courses
            </button>
          </a><br />
          <a
            href='/notes/shared'
            className='border-none bg-transparent text-[#424B5A] font-bold mr-4'
          >
            <button className='px-8 py-3 bg-[#424B5A] text-white rounded-2xl hover:bg-slate-400'>
              Shared Notes
            </button>
          </a><br />
          <a
            href='/notes/public'
            className='border-none bg-transparent text-[#424B5A] font-bold mr-4'
          >
            <button className='px-8 py-3 bg-[#424B5A] text-white rounded-2xl hover:bg-slate-400'>
              Public Notes
            </button>
          </a>
        </>
      ) : (
        <>
          <div>
              <img className='max-w-[45%] rounded-full mr-32 float-right' src='https://assets-global.website-files.com/61a05ff14c09ecacc06eec05/61f5868b789816331ac6af01_5_Benefits_of_Online_Education.png'/>
              <p className='ml-56 mt-20 font-semibold text-6xl'>Collaborative and easy<br/>road to success<br/>in college </p>
              <p className='ml-56 mt-8 text-2xl text-gray-400'>Store, share, and collaborate on notes, homework, and <br/>projects from your computer</p>
              <img className='max-w-[35%] rounded-full mt-8 ml-44 float-left' src='https://cdn.elearningindustry.com/wp-content/uploads/2022/01/shutterstock_525008128.jpg' />
              <div className='mt-4 float-right text-3xl'>  
                <a href='/login'>
                  <button className='px-8 ml-16 py-3 bg-transparent outline outline-offset-2 outline-1 outline-gray-400 text-xl text-[#a6aff8] rounded-xl hover:bg-gray-200 hover:underline'>Go to Home</button>
                </a> 
                <p className='mt-8 mr-[410px]'>Don't have an account?</p>
                <a href='/register'>
                  <button className='px-8 ml-12 mt-4 py-3 bg-[#a6aff8] text-xl text-white rounded-xl hover:bg-blue-800 hover:underline'>Try Webucation</button>
                </a> 
              </div>
          </div>
        </>
      )}
        
    </div>
  )
}

export default Home
