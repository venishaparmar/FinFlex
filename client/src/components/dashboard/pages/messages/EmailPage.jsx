import React from 'react';
import Sidebar from '../../../sidebar/Sidebar';
import GetBorrowers from './GetBorrowers';
import LogoutButton from '../../../LogoutButton';

export default function EmailPage({ setAuth }) {
  return (
    <div className='flex h-full'>
      

      <div className='w-full h-full mx-auto px-8 py-8 mb-4 border bg-white shadow-md rounded'>
        {/* HEADER */}
        <div className='flex items-center justify-between px-4 py-5 sm:px-6 bg-blue-500 rounded shadow-md '>
          {/* TITLE */}
          <div className='text-sm md:text-md text-white pl-2'>
            <Sidebar />
          </div>
          <div className='flex-grow px-4 text-center'>
            <h3 className='text-lg font-medium text-white'>Send Email</h3>
            <p className='text-sm text-white'>Update your client with their loan.</p>
          </div>
          {/* BUTTON */}

          <div className='text-white'>
            {/* Logout Button */}
            <LogoutButton setAuth={setAuth} />
          </div>
        </div>
        <GetBorrowers />
      </div>
    </div>
  );
}
