import { Logout } from '@mui/icons-material';
import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '../../../sidebar/Sidebar';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddBorrower = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    firstname: '',
    lastname: '',
    email: '',
    address: '',
    username: '',
  });

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const { firstname, lastname, contactNumber, address, email, username } =
    inputs;

  const addSuccessful = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
      {
        pending: 'Adding Borrower...',
        success: 'Added Succesfully!',
        error: 'Error!',
      },
      {
        autoClose: 1000,
      }
    );
  };

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { firstname, lastname, contactNumber, address, email, username };

      const response = await fetch('http://localhost:8000/addClient', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      if (response.status === 401) {
        // Display error toast if the user already exists
        toast.error(parseRes.error);
      } else {
        addSuccessful();
        setTimeout(() => navigate(-1), 3000);
      }
    } catch (error) {
      console.log(error.message);
      toast.error('Server error');
    }
  };


  return (
    <div className='flex h-[900px] '>
      <div className='w-full h-[900px] border bg-white shadow-md rounded'>
        <div className='w-full px-8 pt-6 pb-8 mb-4 bg-white  rounded '>
          {/* HEADER */}
          <div className='flex items-center justify-between px-4 py-5 sm:px-6 bg-blue-500 rounded shadow-md '>
            {/* TITLE */}
            <div className='text-sm md:text-md text-white pl-2'>
              <Sidebar />
            </div>
            {/* HEADER CONTENT */}
            <div className='flex-grow px-4 text-center'>
              <h3 className='text-lg font-medium text-white'>Add New Borrower</h3>
              <p className='text-sm text-white'>Register all the required fields.</p>
            </div>
            <ToastContainer />

            {/* BUTTON */}

            <div className='text-white'>
              <button
                className=''
                onClick={(e) => {
                  setAuth(false);
                }}
              >
                <Link to='/login'>
                  <Logout />
                </Link>
              </button>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              onSubmit(e);
            }}
            className='mt-5 p-8 rounded border shadow-md border-t-4 border-t-blue-500 '
          >
            {/* FIRST NAME */}
            <label htmlFor='firstname'>First Name: </label>
            <input
              type='text'
              className='block border border-grey-500 w-full p-3 rounded mb-4'
              name='firstname'
              value={firstname}
              onChange={(e) => {
                onChange(e);
              }}
              placeholder='First Name'
              required
            />
            {/* LAST NAME */}
            <label htmlFor='lastname'>Last Name: </label>
            <input
              type='text'
              className='block border border-grey-500 w-full p-3 rounded mb-4'
              name='lastname'
              value={lastname}
              onChange={(e) => {
                onChange(e);
              }}
              placeholder='Last Name'
              required
            />
            {/* CONTACT NUMBER */}
            <label htmlFor='contactNumber'>Contact Number: </label>
            <input
              type='number'
              className='block border border-grey-500t w-full p-3 rounded mb-4'
              name='contactNumber'
              value={contactNumber}
              onChange={(e) => {
                onChange(e);
              }}
              placeholder='Contact Number'
              required
            />
            {/* ADDRESS */}
            <label htmlFor='address'>Address: </label>
            <input
              type='text'
              className='block border border-grey-500t w-full p-3 rounded mb-4'
              name='address'
              value={address}
              onChange={(e) => {
                onChange(e);
              }}
              placeholder='Address'
              required
            />
            {/* EMAIL ADDRESS */}
            <label htmlFor='email'>Email Address: </label>
            <input
              type='email'
              className='block border border-grey-500t w-full p-3 rounded mb-4'
              name='email'
              value={email}
              onChange={(e) => {
                onChange(e);
              }}
              placeholder='Email'
              required
            />
            {/* USERNAME */}
            <label htmlFor='username'>Username: </label>
            <input
              type='text'
              className='block border border-grey-500t w-full p-3 rounded mb-4'
              name='username'
              value={username}
              onChange={(e) => {
                onChange(e);
              }}
              placeholder='Username'
              required
            />
            {/* BUTTONS */}
            <div className='flex flex-col sm:flex-row sm:justify-start'>
              <button
                type='submit'
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2 sm:mb-0 sm:mr-4 w-full sm:w-auto'
              >
                Save
              </button>
              <Link to='/borrowers' className='w-full sm:w-auto'>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full'>
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBorrower;
