import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LocationOnOutlined,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
} from '@mui/icons-material';
import Sidebar from '../../../sidebar/Sidebar';
import LoanInfo from '../loans/Loan';
import LogoutButton from '../../../LogoutButton';

export default function Borrower({ setAuth }) {
  const [name, setName] = useState('');
  const [contactnumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [client, setClient] = useState(null);

  const location = useLocation();
  const clientId = location.pathname.split('/')[2]; // Extract clientId from URL

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const getClient = async () => {
    try {
      const response = await fetch(`http://localhost:8000/client/${clientId}`, {
        method: 'GET',
        headers: { Authorization: getCookie('token') },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const parseRes = await response.json();

      if (parseRes) {
        setName(parseRes.firstname);
        setContactNumber(parseRes.contactnumber);
        setAddress(parseRes.address);
        setEmail(parseRes.email);
        setClient(parseRes); 
      } else {
        console.error('Invalid response format:', parseRes);
      }
    } catch (error) {
      console.error('Failed to fetch client:', error);
    }
  };

  useEffect(() => {
    getClient();
  }, [clientId]); // Fetch client data whenever clientId changes

  return (
    <div className='h-full flex'>
      <div className='w-full h-full mx-auto px-8 py-8 mb-4 border bg-white shadow-md rounded'>
        {/* BORROWER INFO */}
        <div className='flex items-center justify-between px-4 py-5 sm:px-6 bg-blue-500 rounded shadow-md'>
          <div className='text-sm md:text-md text-white pl-2'>
            <Sidebar />
          </div>
          <div className='flex-grow px-4 text-center'>
            <h3 className='text-lg font-medium text-white'>Borrower Info</h3>
            <p className='text-sm text-white'>All client's information</p>
          </div>
          <div className='text-white'>
            {/* Logout Button */}
            <LogoutButton setAuth={setAuth} />
          </div>
        </div>

        {/* BORROWER ITEMS */}
        <div className='flex flex-wrap justify-between mt-5'>
          {/* ACCOUNT INFO */}
          <div className='w-full h-auto border rounded shadow-md border-t-4 border-t-blue-500 mb-5 sm:mb-0'>
            <div className='py-5 px-5'>
              <div className='flex flex-wrap sm:flex-nowrap justify-between items-start sm:items-center space-x-5'>
                {/* USER INFO */}
                <div className='w-full sm:w-auto ml-4'>
                  <div className='flex items-center'>
                    <PermIdentity className='text-lg sm:text-xl' />
                    <span className='ml-2.5 text-sm sm:text-base'>{name}</span>
                  </div>
                  <div className='flex items-center my-5'>
                    <MailOutline className='text-lg sm:text-xl' />
                    <span className='ml-2.5 text-sm sm:text-base'>{email}</span>
                  </div>
                  <div className='flex items-center my-5'>
                    <PhoneAndroid className='text-lg sm:text-xl' />
                    <span className='ml-2.5 text-sm sm:text-base'>{contactnumber}</span>
                  </div>
                  <div className='flex items-center my-5'>
                    <LocationOnOutlined className='text-lg sm:text-xl' />
                    <span className='ml-2.5 text-sm sm:text-base'>{address}</span>
                  </div>
                  <div className='flex items-center'>
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto'>
                      <Link to={`/editBorrower/${clientId}`} className='block text-center'>
                        UPDATE CLIENT
                      </Link>
                    </button>
                  </div>
                </div>

                {/* You can add more sections for loan info or other details here */}
                {/* LOAN INFO */}
              </div>
            </div>
          </div>
        </div>
        <LoanInfo />
      </div>
    </div>
  );
}
