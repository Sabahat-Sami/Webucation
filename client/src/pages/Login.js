import React from 'react'
import Loading from '../components/Loading.js'
import { useNavigate } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { MailIcon } from '@heroicons/react/outline'
import { LockClosedIcon } from '@heroicons/react/solid'
import { useCookies } from 'react-cookie';
import verifyToken from '../utils/TokenAuth';
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTokenValidity = async () => {
      var payload;
      try {
        payload = await verifyToken(cookies.jwt);
      }
      catch (error) {
        payload = null;
      } 
      finally {
        setLoading(false);
      }
      if (payload == null) {
        removeCookie('jwt');
      }
      else {
        setTimeout(() => {
          navigate('/');
        }, 0);
      }
    };
    if (cookies.jwt && cookies.jwt !== "undefined") {
      //console.log("here");
      fetchTokenValidity();
    }
    else {
      setLoading(false);
      removeCookie('jwt');
    }
  }, [cookies]);

  const handleSubmit = async e => {
    e.preventDefault()
    axios
      .get('http://localhost:8080/user/log_in', {
        params: {
          email: email,
          password: password,
        },
      })
      .then(res => {
        console.log(res)
        if (res.status === 200){
          setCookie('jwt', res.data.token);
          setTimeout(() => {
            navigate('/');
          }, 0);
        }
      })
      .catch(err => {
        console.log(err)
      })
  };

  return (
    <>
    {
      (loading) ? (
        <Loading />
      ) : (
        <div className='flex justify-center items-center h-screen'>
          <div className='max-w-[1240px] mx-auto'>
            <div className='p-5'>
              <div className='text-center'>
                <h2 className='text-5xl font-bold text-[#424B5A]'>Welcome Back!</h2>
                <h4 className='text-[#424B5A] mt-4'>
                  Sign in to access your profile!
                </h4>
              </div>

              <div className='py-9 md:grid-cols-3 gap-1 px-2 text-center'>
                <form onSubmit={e => handleSubmit(e)}>
                  <div className='flex block border border-grey-light bg-white w-full p-3 mb-4 rounded-3xl pl-5 shadow-xl'>
                    <MailIcon className='w-8 flex justify-between items-center text-gray-500' />
                    <input
                      required
                      type='text'
                      className='w-full p-3 ml-3 rounded-3xl pl-5'
                      placeholder='Email Address'
                      id='email'
                      onChange={e => setEmail(e.target.value)}
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
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type='submit'
                    className='text-white bg-[#707FDD] w-full text-center py-3 rounded-2xl  my-1 shadow-xl'
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )
    }
    </>
    
  )
}

export default Login
