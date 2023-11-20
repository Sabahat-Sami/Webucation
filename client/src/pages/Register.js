import { useState } from 'react'
import { ShieldCheckIcon, IdentificationIcon, MailIcon, UserIcon, PhoneIcon} from '@heroicons/react/outline'
import { LockClosedIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import React from 'react'

const Register = () => {
  const [email, setEmail] = useState('')
  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [number, setNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()

    axios
      .post('http://localhost:8080/user/create_profile', {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        fname: fname,
        lname: lname,
        phone_num: number,
      },
      )
      .then(res => {
        console.log(res)
        if (res.status === 200){
          navigate('/login')
          setEmail('')
          setPassword('')
          setConfirmPassword('')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className='flex items-center h-screen'>
      <div className='max-w-[1240px] mx-auto'>
        <div className='p-5'>
          <div className='text-center'>
            <h2 className='text-5xl font-bold text-[#424B5A]'>
              Welcome Student.
            </h2>
            <h4 className='text-[#424B5A] mt-4'>Sign up improve your study habits!</h4>
          </div>

          <div className='py-9 px-2 columns-2 gap-5 text-center'>
            <form onSubmit={e => handleSubmit(e)}>
              <div className='flex block border border-grey-light bg-white w-full p-3 mb-4 rounded-3xl pl-5 shadow-xl'>
                <MailIcon className='w-8 flex justify-between items-center text-gray-500' />
                <input
                  required
                  type='text'
                  className='w-full p-3 ml-3 rounded-3xl pl-5'
                  placeholder='Email Address'
                  value={email}
                  id='email'
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

            <div className='flex block border border-grey-light bg-white w-full p-3 mb-4 rounded-3xl pl-5 shadow-xl'>
                <UserIcon className='w-8 flex justify-between items-center text-gray-500' />
                <input
                  required
                  type='text'
                  className='w-full p-3 ml-3 rounded-3xl pl-5'
                  placeholder='First Name'
                  value={fname}
                  id='fname'
                  onChange={e => setFname(e.target.value)}
                />
              </div>

            <div className='flex block border border-grey-light bg-white w-full p-3 mb-4 rounded-3xl pl-5 shadow-xl'>
                <IdentificationIcon className='w-8 flex justify-between items-center text-gray-500' />
                <input
                  required
                  type='text'
                  className='w-full p-3 ml-3 rounded-3xl pl-5'
                  placeholder='Last Name'
                  value={lname}
                  id='lname'
                  onChange={e => setLname(e.target.value)}
                />
              </div>

            <div className='flex block border border-grey-light bg-white w-full p-3 mb-4 rounded-3xl pl-5 shadow-xl'>
                <PhoneIcon className='w-8 flex justify-between items-center text-gray-500' />
                <input
                  required
                  type='text'
                  className='w-full p-3 ml-3 rounded-3xl pl-5'
                  placeholder='Phone Number'
                  value={number}
                  id='number'
                  onChange={e => setNumber(e.target.value)}
                />
              </div>

              <div className='flex block border border-grey-light bg-white w-full p-3 mb-4 rounded-3xl pl-5 shadow-xl'>
                <LockClosedIcon className='w-8 flex justify-between items-center text-gray-500' />
                <input
                  required
                  type='password'
                  className='w-full p-3 ml-3 rounded-3xl pl-5'
                  placeholder='Password'
                  id='password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <div className='flex block border border-grey-light bg-white w-full p-3 mb-4 rounded-3xl pl-5 shadow-xl'>
                <ShieldCheckIcon className='w-8 flex justify-between items-center text-gray-500' />
                <input
                  required
                  type='password'
                  className='w-full p-3 ml-3 rounded-3xl pl-5'
                  placeholder='Confirm Password'
                  value={confirmPassword}
                  id='password'
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                type='submit'
                className='text-white bg-[#707FDD] w-full text-center py-3 rounded-2xl  my-1 shadow-xl'
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
