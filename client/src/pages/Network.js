import React from 'react'
import { friends, may_know } from './data'

const Network = () => {
  return (
    <div>
      <h1 className='w-42 text-4xl font-black tracking-tight text-transparent'>Reviews</h1>
      <h1 className='w-42 text-4xl mt-16 mb-4 ml-8 font-black tracking-tight text-gray-900 dark:text-white'>Your Friends</h1>
      <div className='ml-4 mr-4 mb-32 grid gap-4 grid-cols-4 space-y-5 text-2xl'>
        {friends.map((val) => {
          return (
            <div className='max-w-xl p-6 bg-white border border-slate-300 rounded-lg dark:bg-gray-800 dark:border-gray-700'>
              <h1 className='w-42 mb-5 text-4xl font-black tracking-tight underline decoration-sky-500 text-gray-900 dark:text-white'>{val.name}</h1>
              <img className="rounded-full" src={val.pfp}/>
              <p className='mb-3 mt-3 font-normal text-gray-700'>{val.grad} </p>
              <p className='mb-3 text-lg font-normal text-gray-700'>Shared Courses: {val.shared_courses.map(course => (
                <li>
                  {course}
                </li>
              ))}   </p>
              <button className='place-content-center px-8 text-sm py-3 bg-[#424B5A] text-white rounded-full hover:bg-slate-400 hover:cursor-pointer'>Send Message</button>
            </div>
          )
        })}

      </div>
      
      <h1 className='w-42 text-4xl mt-16 mb-8 ml-8 font-black tracking-tight text-gray-900 dark:text-white '>You may know...</h1>
      <div className='ml-4 mr-4 mb-32 grid gap-4 grid-cols-4 space-y-5 text-2xl'>
        {may_know.map((val) => {
          return (
            <div className='max-w-xl p-6 bg-white border border-slate-300 rounded-lg dark:bg-gray-800 dark:border-gray-700'>
              <h1 className='w-42 mb-5 text-4xl font-black tracking-tight underline decoration-sky-500 text-gray-900 dark:text-white'>{val.name}</h1>
              <img className="rounded-full" src={val.pfp} />
              <p className='mb-3 mt-3 font-normal text-gray-700'>{val.grad} </p>
              <p className='mb-3 text-lg font-normal text-gray-700'>Shared Courses: {val.shared_courses.map(course => (
                <li>
                  {course}
                </li>
              ))}   </p>
              <button className='place-content-center px-8 text-sm py-3 bg-[#424B5A] text-white rounded-full hover:bg-slate-400 hover:cursor-pointer'>Connect</button>
            </div>
          )
        })}

      </div>
    </div>
  )
}

export default Network
