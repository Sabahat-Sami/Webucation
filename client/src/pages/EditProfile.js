import React from 'react'

export default function EditProfile() {
    const user = {
        email: "sabahatsami@nyu.edu",
        password: "password",
        fname: "Sabahat",
        lname: "Sami",
        phone_num: "123-456-7890",
        grad: "Spring 2024",
        numFriends: 14,
        about: "I am a computer science major interested in Psychology stuff. I'm from Queens, New York but my family felt like leaving \
                to Ohio for some reason. I made this stupid web application for a design project course at NYU, but it's turning out to \
                be a pretty awful experience. I can't wait for this semester to be over."

    }

  return (
    <div>
        <br/>
            <img src="https://media.licdn.com/dms/image/C4D03AQFwzb4_V7DTPw/profile-displayphoto-shrink_800_800/0/1623803824719?e=1706140800&v=beta&t=JI_0IXhNQfXo8NzcOMGl23kEpeHrKiyRHytXWE9L_HQ"
               className='float-right mt-[8%] rounded-full w-[25%] mr-[20%] outline outline-offset-2 outline-4 outline-gray-400'/>
            <p className='ml-[15%] mt-[8%] underline text-5xl'>{user.fname + " " + user.lname}</p>
            <p className='ml-[15%] mt-8 text-2xl'>Expected Graduation: {user.grad}</p>
            <a href='/network'><p className='ml-[15%] mt-4 text-2xl hover:underline hover:text-blue-500'>{user.numFriends} connections</p></a>
            <p className='ml-[15%] mt-8 text-3xl underline'>Contact Info</p>
            <p className='ml-[15%] mt-4 text-2xl '>Email: {user.email}</p>
            <p className='ml-[15%] mt-2 text-2xl '>Phone: {user.phone_num}</p>
            <p className='ml-[15%] mt-8 text-3xl underline'>About Me</p>
            <p className='ml-[15%] mr-[15%] mt-4 text-2xl'>{user.about}</p>
            <a href='/register'>
                <button className='ml-[45%] px-8 ml-12 mt-4 py-3 bg-[#a6aff8] text-xl text-white rounded-full hover:bg-blue-800 hover:py-4 hover:px-10 hover:ml-[44.5%]'>
                    Save Changes
                </button>
            </a> 
    </div>
  )
}
