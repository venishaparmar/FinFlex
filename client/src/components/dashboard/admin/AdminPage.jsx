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

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const getAdmin = async () => {
    try {
      const response = await fetch(`http://localhost:8000/profile`, {
        method: 'GET',
        headers: { Authorization: getCookie('token') },
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

        {/* Main container for account info and admins */}
        <div className="flex flex-col w-full mt-5 gap-5">

          {/* Account Info Box - Horizontal Layout */}
          <div className="w-full flex justify-center md:justify-start border rounded shadow-md border-t-4 border-t-blue-500 p-5">
            <div className="flex flex-col items-start space-y-5 w-full">
              <h3 className="text-xl border-b-2 w-full mb-4">Account Details</h3>
              <div className="space-y-4 w-full">
                {/* Name */}
                <div className="flex items-center">
                  <PermIdentity className="text-lg" />
                  <span className="ml-2.5 text-base lg:text-lg">{name}</span>
                </div>

                {/* Address */}
                <div className="flex items-center">
                  <LocationOnOutlined className="text-lg" />
                  <span className="ml-2.5 text-base lg:text-lg">{address}</span>
                </div>

                {/* Email */}
                <div className="flex items-center">
                  <MailOutline className="text-lg" />
                  <div
                    className="ml-2.5 text-base lg:text-lg w-full max-w-[300px] overflow-hidden text-ellipsis"
                    title={email}  // Tooltip with full email
                  >
                    {email}
                  </div>
                </div>
                {/* Contact Number */}
                <div className="flex items-center">
                  <PhoneAndroid className="text-lg" />
                  <span className="ml-2.5 text-base lg:text-lg">{contactNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admins Component Below Account Info */}
          <div className="w-full">
            <Admins />
          </div>

        </div>


      </div>
    </div>

  );
}
