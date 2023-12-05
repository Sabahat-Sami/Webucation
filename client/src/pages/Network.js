import React from 'react'
import { friends, may_know } from './data'
import { useState, useRef, useEffect } from 'react'
import { useCookies } from "react-cookie";
import axios from 'axios';

const Network = () => {

  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const [friendEmail, setFriendEmail] = useState("");
  const [friendList, setFriendList] = useState([])
  const [buttonFriendId, setButtonFriendId] = useState("")


  function getData(user_id, jwt_token){
    try {
      axios.get('http://localhost:8080/user/get_profile_friends/',{
          params: {
            user_id: cookies.user_id,
          },
          headers: {
              Authorization: `Bearer ${cookies.jwt}`
          }
      }).then(res => {
          if (res.status === 200 ) {
            console.log(res.data)

            res.data.forEach(function(friend){
              if(friend["pfp"] == null){
                friend["pfp"] = "https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"
              }
            });
    
            setFriendList(res.data)

          }
      }).catch(err => console.log(err))
    }
    catch (e) {
        console.log(e);
    }
  }




  useEffect(() => {
    getData(cookies.user_id,  `Bearer ${cookies.jwt}`)
  }, [])

  const addFriend = async e => {
    e.preventDefault()
    try {
      axios.post('http://localhost:8080/user/create_profile_friends/', {
          user_id: `${cookies.user_id}`,
          friend_email: `${friendEmail}`,
      }, {
          headers: {
              Authorization: `Bearer ${cookies.jwt}`
          }
      }).then(res => {
          if (res.status === 200 ) {
            // UPDATE FRIENDS LIST ON WEBSITE
            getData(cookies.user_id,  `Bearer ${cookies.jwt}`)
          }
      }).catch(err => console.log(err))
    }
    catch (e) {
        console.log(e);
    }


  }



  const removeFriend = async (e, friend_id) => {
    e.preventDefault()
    try {
      axios.delete('http://localhost:8080/user/delete_friend/', {
      headers: {
          Authorization: `Bearer ${cookies.jwt}`
      },
      data: {
          user_id: `${cookies.user_id}`,
          friend_id: friend_id,
      }
          
      }).then(res => {
          if (res.status === 200 ) {
            // UPDATE FRIENDS LIST ON WEBSITE
            getData(cookies.user_id,  `Bearer ${cookies.jwt}`)
          }
      }).catch(err => console.log(err))
    }
    catch (e) {
        console.log(e);
    }
  }

  
console.log(friendList)


  return (
    <div>
      <h1 className='w-42 text-4xl font-black tracking-tight text-transparent'>Reviews</h1>

      {/* I HAVE NO IDEA WHAT IM DOING */}

      <br></br><br></br><br></br><br></br>
      <p className='ml-[5%] mt-2 text-2xl '>Add a friend: 

        <input className='ml-6 mt-2 text-2xl h-11 rounded-xl resize-x w-[30%] px-2 py-2' 
          placeholder="Enter your friend's e-mail address" 
          value = {friendEmail} onChange= {e => {setFriendEmail(e.target.value)}}>
        </input>

        <button className='ml-[44.5%] px-8 ml-12 mt-4 py-3 bg-[#424B5A] text-xl text-white rounded-full hover:bg-slate-400 hover:cursor-pointer' onClick={addFriend}>Add friend</button>
      </p> 

      {/* I HAVE NO IDEA WHAT IM DOING */}




      <h1 className='w-42 text-4xl mt-16 mb-4 ml-8 font-black tracking-tight text-gray-900 dark:text-white'>Your Friends</h1>
      <div className='ml-4 mr-4 mb-32 grid gap-4 grid-cols-6 space-y-5 text-2xl'>
        {friendList?.map((val) => {
          return (
            <div className='max-w-xs p-6 bg-white border border-slate-300 rounded-lg dark:bg-gray-800 dark:border-gray-700'>
              <h1 className='w-42 mb-5 text-4xl font-black tracking-tight underline decoration-sky-500 text-gray-900 dark:text-white'>{val.name}</h1>
              <img className="rounded-full" src={val.pfp}/>
              <p className='mb-3 mt-3 font-normal text-gray-700'>{val.grad} </p>
              <p className='mb-3 text-lg font-normal text-gray-700'>Shared Courses: {val.shared_courses?.map(course => (
                <li>
                  {course}
                </li>
              ))}   </p>
              <button className='place-content-center px-8 text-sm py-3 bg-[#424B5A] text-white rounded-full hover:bg-slate-400 hover:cursor-pointer' onClick={(e) => removeFriend(e, val.id)}> Remove friend</button>
            </div>
          )
        })}

      </div>
      
    </div>
  )
}

export default Network
