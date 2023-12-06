import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useCookies } from "react-cookie";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

export default function EditProfile() {
    const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
    

    const inputRef = useRef(null);
    const navigate = useNavigate()
  const [pfp, setPfp] = useState("https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg")
    const [newPfp, setNewPfp] = useState(null)
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone_num, setNum] = useState("");
    const [about, setAbout] = useState("");

    // useEffect(() => {
    //     try {
    //       axios.get('http://localhost:8080/user/get_profile/', {
    //           headers: {
    //               Authorization: `Bearer ${cookies.jwt}`
    //           }
    //       }).then(res => {
    //           if (res.status === 200 ) {
    //             setEmail(res.data.email)
    //             setName(res.data.fname + " " + res.data.lname)
    //             setNum(res.data.phone_number)
    //             setAbout(res.data.about)
    //             if(res.data.profile_picture == null){
    //               setPfp("https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg")
    //               setNewPfp("https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg")
    //             }
    //             else{
    //               setPfp(res.data.profile_picture)
    //               setNewPfp(res.data.profile_picture)
    //             }
    //           }
    //       }).catch(err => console.log(err))
    //     }
    //     catch (e) {
    //         console.log(e);
    //     }
    //   }, [])

    const handleImageClick = () => {
      inputRef.current.click();
    }
    
    function handleImageChange(e) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewPfp(reader.result)
      }

      const img = URL.createObjectURL(e.target.files[0])
      setPfp(img);

      reader.readAsDataURL(e.target.files[0]);
    }

    // const saveProfile = async e => {
    //   e.preventDefault()
      

    //   try {
    //     axios.put('http://localhost:8080/user/update_profile/', {
    //       user_id: `${cookies.user_id}`,
    //       new_email: `${email}`,
    //       phone_num: `${phone_num}`,
    //       about_me: `${about}`,
    //       profile_picture: `${newPfp}`,

    //     }, {
    //         headers: {
    //             Authorization: `Bearer ${cookies.jwt}`
    //         }
    //     }).then(res => {
    //         if (res.status === 200 ) {
    //             setCookie('jwt', res.data.token, {path: "/"});
    //             setCookie('user_id', res.data.user_id, {path: "/"})
    //             setTimeout(() => {
    //               navigate('/profile');
    //             }, 0);
    //         }
    //     }).catch(err => console.log(err))
    //   }
    //   catch (e) {
    //       console.log(e);
    //   }
    // }



    // const delete_pfp = async e => {
    //   e.preventDefault()
      

    //   try {
    //     axios.put('http://localhost:8080/user/delete_profile_picture/', {
    //       user_id: `${cookies.user_id}`,
    //     }, {
    //         headers: {
    //             Authorization: `Bearer ${cookies.jwt}`
    //         }
    //     }).then(res => {
    //         if (res.status === 200 ) {
    //           setPfp("https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg")
    //           setNewPfp("https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg")
    //         }
    //     }).catch(err => console.log(err))
    //   }
    //   catch (e) {
    //       console.log(e);
    //   }
    // }



    
  return (
    <div>
        <br/>
            <div onClick={handleImageClick} className=''>
                <button className='float-right px-4 mt-[8%] ml-[50%] mr-[20%] py-3 bg-red-300 text-sm text-white rounded-full hover:bg-red-800 hover:py-4'
                // onClick={delete_pfp} 
                >
                  Remove avatar
                </button>
                <p className='absolute ml-[55%] mr-[25%] mt-[20%] w-[25%] h-[15%] text-xl opacity-0 hover:cursor-pointer hover:opacity-100 duration-300 inset-0 z-10 flex justify-center items-center font-semibold'>
                  Change photo
                </p>
                <img  src={pfp}
          className='float-right mb-8 z-0 rounded-full w-[25%] max-h-[450px] max-w-[450px] min-h-[450px] min-w-[450px] flex-1 mr-[20%] outline outline-offset-2 outline-4 outline-gray-400 hover:cursor-pointer hover:opacity-75 hover:scale-110 '/>
                <input
                  className='float-right mt-8 px-3 py-3 rounded-full w-[25%] ml-[40%] mr-[20%] outline outline-offset-2 outline-4 outline-gray-400'
                  type='file'
                  ref={inputRef}
                  style={{display: "none"}}
                  accept=".jpeg, .png, .jpg"
                  onChange={handleImageChange}>
                </input>
            </div>

            <p className='ml-[15%] mt-[8%] underline text-5xl'>{name}</p>
            <br></br>
            <p className='ml-[15%] mt-3 text-3xl underline'>Contact Info</p>
            <p className='ml-[15%] mt-2 text-2xl '>Email: <textarea className='ml-6 mt-2 text-2xl h-11 rounded-xl resize-x w-[30%] px-2 py-2' value = {email} onChange= {e => {setEmail(e.target.value)}}></textarea></p> 
            <p className='ml-[15%] mt-2 text-2xl '>Phone: <textarea className='ml-4 mt-2 text-2xl h-11 rounded-xl resize-x w-[30%] px-2 py-2' value = {phone_num} onChange= {e => {setNum(e.target.value)}}></textarea></p> 
            <p className='ml-[15%] mt-8 text-3xl underline'>About Me</p>
            <textarea className='ml-[15%] mr-[15%] mt-4 text-2xl w-[65%] h-[20%] px-4 py-4 rounded-2xl resize-y' value = {about} 
            onChange= {e => {setAbout(e.target.value)}}
            ></textarea>
            <a href='/profile'>
                <button className='ml-[44.5%] px-8 ml-12 mt-4 py-3 bg-[#a6aff8] text-xl text-white rounded-full hover:bg-blue-800 hover:py-4 hover:px-10' 
                // onClick={saveProfile} 
                >
                    Save Changes
                </button>
            </a> 
    </div>
  )
}
