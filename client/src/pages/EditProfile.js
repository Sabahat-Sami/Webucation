import React from 'react'
import { useState, useRef } from 'react'

export default function EditProfile() {
      // @ Ivan : the user below should be set to whatever user is logged in at the moment
    let user = {
        email: "sabahatsami@nyu.edu",
        password: "password",
        fname: "Sabahat",
        lname: "Sami",
        phone_num: "123-456-7890",
        grad: "Spring 2024",
        numFriends: 14,
        about: "I am a computer science major interested in Psychology stuff. I'm from Queens, New York but my family felt like leaving to Ohio for some reason. I made this stupid web application for a design project course at NYU, but it's turning out to be a pretty awful experience. I can't wait for this semester to be over.",
        pfp: "https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"
    }
    
    const inputRef = useRef(null);
    const [image, setImage] = useState(user.pfp);

    const handleImageClick = () => {
      inputRef.current.click();
    }
    
    function handleImageChange(e) {
      const img = URL.createObjectURL(e.target.files[0])// @ Ivan : modify the user's pfp to this img variable
      setImage(img);
    }

  return (
    <div>
        <br/>
            <div onClick={handleImageClick} className=''>
                <img  src={image}
                      className='float-right mt-[8%] rounded-full w-[25%] mr-[20%] outline outline-offset-2 outline-4 outline-gray-400 hover:cursor-pointer hover:opacity-75 hover:scale-110'/>
                <input
                  className='float-right mt-8 px-3 py-3 rounded-full w-[25%] ml-[40%] mr-[20%] outline outline-offset-2 outline-4 outline-gray-400'
                  type='file'
                  ref={inputRef}
                  style={{display: "none"}}
                  onChange={handleImageChange}>
                </input>
            </div>

            <p className='ml-[15%] mt-[8%] underline text-5xl'>{user.fname + " " + user.lname}</p>
            <p className='ml-[15%] mt-2 text-2xl '>Expected Graduation: <textarea className='ml-6 mt-2 text-2xl h-11 rounded-xl resize-x px-2 py-2'>{user.grad}</textarea></p> 
            <p className='ml-[15%] mt-4 text-2xl'>{user.numFriends} connections</p>
            <p className='ml-[15%] mt-3 text-3xl underline'>Contact Info</p>
            <p className='ml-[15%] mt-2 text-2xl '>Email: <textarea className='ml-6 mt-2 text-2xl h-11 rounded-xl resize-x w-[30%] px-2 py-2'>{user.email}</textarea></p> 
            <p className='ml-[15%] mt-2 text-2xl '>Phone: <textarea className='ml-4 mt-2 text-2xl h-11 rounded-xl resize-x w-[30%] px-2 py-2'>{user.phone_num}</textarea></p> 
            <p className='ml-[15%] mt-8 text-3xl underline'>About Me</p>
            <textarea className='ml-[15%] mr-[15%] mt-4 text-2xl w-[65%] h-[20%] px-4 py-4 rounded-2xl resize-y'>{user.about}</textarea>
            <a href='/profile'>
                <button className='ml-[45%] px-8 ml-12 mt-4 py-3 bg-[#a6aff8] text-xl text-white rounded-full hover:bg-blue-800 hover:py-4 hover:px-10 hover:ml-[44.5%]'>
                    Save Changes
                </button>
            </a> 
    </div>
  )
}
