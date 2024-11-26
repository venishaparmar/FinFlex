import React, { useState, useEffect } from 'react';
import Sidebar from '../../../sidebar/Sidebar';
import BotWidget from './bottom/BotWidget';
import TopWidget from './top/TopWidget';
import { Link } from 'react-router-dom';
import { Logout, PermIdentity } from '@mui/icons-material';

export default function Home({ setAuth }) {
  const [name, setName] = useState('');

  const getProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/profile', {
        method: 'GET',
        headers: { Authorization: localStorage.getItem('token') },
      });

      const parseRes = await response.json();
      setName(`${parseRes.firstName} ${parseRes.lastName}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className='flex flex-col md:flex-row min-h-screen'>
    <div className='w-full px-4 md:px-8 py-6 bg-white border rounded shadow-md flex flex-col justify-between'>
  
      {/* Flex container for Sidebar and Header */}
      <div className='flex flex-row items-center bg-blue-500 rounded shadow-md'>
  
        {/* Sidebar */}
        <div className='text-sm md:text-md text-white pl-2'>  
          <Sidebar />
        </div>
  
        {/* Header Content */}
        <div className='flex-grow px-4 py-5 flex flex-col justify-center'>
          <h3 className='text-lg md:text-2xl font-medium text-white'>
            WELCOME {name}
          </h3>
          <span className='text-sm md:text-md text-white'>
            Logged in: {new Date().toLocaleTimeString()}
          </span>
        </div>
  
        {/* Additional Options (Profile, Logout, Date) */}
        <div className='flex flex-col md:flex-row items-center space-x-0 md:space-x-4 px-4 mt-4 md:mt-0'>
          {/* Date */}
          <span className='text-sm md:text-lg text-white mb-2 md:mb-0'>
            {new Date().toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
  
          <div>
            {/* Profile Icon */}
          <Link to='/admin' className='text-white hover:scale-105 mb-2 md:mb-0'>
            <PermIdentity fontSize='large' className='text-sm md:text-lg text-white' />
          </Link>
  
          {/* Logout Button */}
          <button
            className='text-white hover:scale-105'
            onClick={() => setAuth(false)}
          >
            <Link to='/login'>
              <Logout fontSize='large' className='text-sm md:text-lg text-white' />
            </Link>
          </button>
          </div>
        </div>
      </div>
  
      {/* WIDGETS */}
      <div className='flex flex-col space-y-6 mt-6'>
        <TopWidget />
        <BotWidget />
      </div>
    </div>
  </div>
  
  );
}
