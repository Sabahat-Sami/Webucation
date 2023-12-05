import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useCookies } from "react-cookie";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

export default function Profile() {

  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone_num, setNum] = useState("");
  const [numFriends, setNumFriends] = useState("");
  const [about, setAbout] = useState("");
  const [pfp, setPfp] = useState("");

  useEffect(() => {
    try {
      axios.get('http://localhost:8080/user/get_profile/', {
          headers: {
              Authorization: `Bearer ${cookies.jwt}`
          }
      }).then(res => {
          if (res.status === 200 ) {
            setEmail(res.data.email)
            setName(res.data.fname + " " + res.data.lname)
            setNum(res.data.phone_number)
            setAbout(res.data.about)
            setNumFriends(res.data.numFriends)
            if(res.data.picture == null){
              setPfp("https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg")
            }
            else{
              setPfp(res.data.picture)
            }

          }
      }).catch(err => console.log(err))
    }
    catch (e) {
        console.log(e);
    }
  }, [])


  return (
    <div>
        <br/>
            <img src={pfp}
               className='float-right mt-[8%] rounded-full w-[25%] mr-[20%] outline outline-offset-2 outline-4 outline-gray-400'/>
            <p className='ml-[15%] mt-[8%] underline text-5xl' >{name}</p>
            <p className='ml-[15%] mt-4'><a href='/network' className='text-2xl hover:underline hover:text-blue-500'>{numFriends} connections</a></p>
            <p className='ml-[15%] mt-8 text-3xl underline'>Contact Info</p>
            <p className='ml-[15%] mt-4 text-2xl '>Email: {email}</p>
            <p className='ml-[15%] mt-2 text-2xl '>Phone: {phone_num}</p>
            <p className='ml-[15%] mt-8 text-3xl underline'>About Me</p>
            <p className='ml-[15%] mr-[15%] mt-4 text-2xl'>{about}</p>
            <a href='/editProfile'>
                <button className='ml-[44.5%] px-8 ml-12 mt-4 py-3 bg-[#a6aff8] text-xl text-white rounded-full hover:bg-blue-800 hover:py-4 hover:px-10'>
                    Edit Profile
                </button>
            </a> 
    </div>
  )
}
