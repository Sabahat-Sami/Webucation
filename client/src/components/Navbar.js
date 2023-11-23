import React from 'react';
import { NewspaperIcon } from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function Navbar() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);

  const handleLogout = () => {
    removeCookie('jwt');
    navigate('/');
  };

  return (
    <div className='w-screen h-[80px] z-10 bg-[#d9defa] fixed drop-shadow-lg '>
      <div className='px-2 flex justify-between items-center w-full h-full'>
        <div className='flex items-center ml-60 text-[#424B5A]'>
          <NewspaperIcon className='w-10 ' />
          <a href='/'>
            <h1 className='text-3cl font-bold mr-4 sm:text-4xl text-[#424B5A]'>
              Webucation.
            </h1>
          </a>
        </div>

        <div className='hidden md:flex pr-4 mr-60'>
          {cookies.jwt ? (
            <>
              <a
                href='/profile'
                className='border-none bg-transparent text-[#424B5A] font-bold mr-4 flex justify-center items-center'
              >
                <button className='px-8 py-3 bg-[#424B5A] text-white rounded-2xl hover:bg-slate-400'>
                  Profile
                </button>
              </a>
              <button
                className='px-8 py-3 bg-[#424B5A] font-bold text-white rounded-2xl hover:bg-slate-400'
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <a
                href='/login'
                className='border-none bg-transparent text-[#424B5A] font-bold mr-4 flex justify-center items-center'
              >
                <button className='px-8 py-3 bg-[#424B5A] text-white rounded-2xl hover:bg-slate-400'>
                  Log In
                </button>
              </a>
              <a
                href='/register'
                className='border-none bg-transparent text-[#424B5A] font-bold mr-4 flex justify-center items-center'
              >
                <button className='px-8 py-3 bg-[#424B5A] text-white rounded-2xl hover:bg-slate-400'>
                  Sign Up
                </button>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
