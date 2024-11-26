import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LocationOnOutlined,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
  Logout,
} from '@mui/icons-material';

import Sidebar from '../../sidebar/Sidebar';
import Admins from './AllAdmins';

export default function AdminPage({ setAuth }) {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState();
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');

  const getAdmin = async () => {
    try {
      const response = await fetch(`http://localhost:8000/profile`, {
        method: 'GET',
        headers: { Authorization: localStorage.getItem('token') },
      });

      const parseRes = await response.json();
      console.log(parseRes);

      setName(parseRes.firstName + ' ' + parseRes.lastName);
      setContactNumber(parseRes.contactNumber);
      setAddress(parseRes.address);
      setEmail(parseRes.email);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAdmin();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full px-4 md:px-8 py-6 bg-white border rounded shadow-md flex flex-col justify-between">
        {/* Flex container for Sidebar and Header */}
        <div className="flex flex-row items-center bg-blue-500 rounded shadow-md">
          {/* Sidebar */}
          <div className="text-sm md:text-md text-white pl-2">
            <Sidebar />
          </div>

          {/* Header Content */}
          <div className="flex-grow px-4 py-5 flex flex-col justify-center">
            <h3 className="text-lg md:text-2xl font-medium text-white">
              WELCOME {name}
            </h3>
            <span className="text-sm md:text-md text-white">
              Logged in: {new Date().toLocaleTimeString()}
            </span>
          </div>

          {/* Additional Options (Profile, Logout, Date) */}
          <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 px-4 mt-4 md:mt-0">
            {/* Date */}
            <span className="text-sm md:text-lg text-white mb-2 md:mb-0">
              {new Date().toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>

            <div>
              {/* Profile Icon */}
              <Link to='/admin' className="text-white hover:scale-105 mb-2 md:mb-0">
                <PermIdentity fontSize="large" className="text-sm md:text-lg text-white" />
              </Link>

              {/* Logout Button */}
              <button
                className="text-white hover:scale-105"
                onClick={() => setAuth(false)}
              >
                <Link to="/login">
                  <Logout fontSize="large" className="text-sm md:text-lg text-white" />
                </Link>
              </button>
            </div>
          </div>
        </div>

        {/* Flex container for Account Info and Admins */}
        <div className="flex flex-col md:flex-row gap-10">
          {/* ACCOUNT INFO */}
          <div className="w-full md:w-1/4 h-[720px] mt-5 border rounded shadow-md border-t-4 border-t-blue-500">
            <div className="py-5 px-5">
              <h3 className="text-xl mb-5 border-b-2">Account Details</h3>
              <div className="flex flex-col justify-between items-start py-5 px-5">
                {/* USER INFO */}
                <div>
                  <div>
                    <div className="flex items-center my-5">
                      <PermIdentity className="text-lg" />
                      <span className="ml-2.5 text-base lg:text-lg">{name}</span>
                    </div>
                    <div className="flex items-center my-5">
                      <LocationOnOutlined className="text-lg" />
                      <span className="ml-2.5 text-base lg:text-lg">{address}</span>
                    </div>
                  </div>
                  <div className="flex items-center my-5">
                    <MailOutline className="text-lg" />
                    <div 
    className="ml-2.5 text-base lg:text-lg w-48 overflow-hidden whitespace-nowrap text-ellipsis"
    title={email} // Tooltip with full email
  >
    {email}
  </div>
                  </div>

                  <div className="flex items-center my-5">
                    <PhoneAndroid className="text-lg" />
                    <span className="ml-2.5 text-base lg:text-lg">{contactNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OTHER ADMIN */}
          <Admins />
        </div>
      </div>
    </div>

  );
}
