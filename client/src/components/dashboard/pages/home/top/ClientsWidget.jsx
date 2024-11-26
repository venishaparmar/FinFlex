import { AddBox, PermIdentity } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';

export default function ClientsWidget() {
  const [clients, setClients] = useState([]);

  const getClients = async () => {
    try {
      const response = await fetch('http://localhost:8000/allClients', {
        method: 'GET',
        headers: { Authorization: localStorage.getItem('token') },
      });

      const parseRes = await response.json();
      setClients(parseRes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      {/* CLIENTS */}
      <div
        className='mt-5 p-6 sm:p-8 rounded-xl border border-t-4 border-t-blue-500 cursor-pointer
        hover:bg-blue-500 hover:text-white transition duration-150 ease-in-out shadow-md
        flex flex-col items-center sm:items-start text-center sm:text-left'
      >
        <div className='flex justify-between items-center w-full'>
          <span className='text-lg sm:text-xl font-semibold'>Borrowers</span>
        </div>
        <div className='my-3 flex items-center space-x-2'>
          <PermIdentity fontSize='large' />
          <span className='text-3xl sm:text-4xl'>{clients.length}</span>
        </div>
        <span className='text-base sm:text-lg'>Total Clients Serviced</span>
      </div>
    </div>
  );
}
