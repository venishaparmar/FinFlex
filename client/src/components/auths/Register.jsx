import React, { useState } from 'react';

import { ArrowBackIosNew } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Register = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    firstname: '',
    lastname: '',
    email: '',
    address: '',
    username: '',
    password: '',
  });

  const {
    firstname,
    lastname,
    contactNumber,
    address,
    email,
    username,
    password,
  } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        firstname,
        lastname,
        contactNumber,
        address,
        email,
        username,
        password,
      };

      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };

      if (parseRes.token) {
        getCookie('token', parseRes.token);
        console.log(parseRes.token);
        setAuth(true);
      } else {
        setAuth(false);
        console.log('Something wrong');
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='flex flex-col h-[750px] w-[620px] border rounded-md shadow-md  mx-auto my-20 justify-center flex-wrap border-t-4 border-t-blue-500 '>
      {/* FORM */}
      <div className=''>
        <div className='flex justify-between items-center  px-8 py-8'>
          {/* GREETINGS */}
          <div className='mt-5'>
            <h1 className='text-xl font-semibold '>
              Welcome to <span className='text-blue-500'>FinFlex</span>.
            </h1>
            <small className='text-gray-400'>Please enter your details</small>
          </div>

          {/* BACK ARROW */}
          <div className=''>
            <Link to='/admin'>
              <ArrowBackIosNew />
            </Link>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            onSubmit(e);
          }}
          className='bg-white px-8  pb-8 mb-4'
        >
          <div className='flex w-full gap-5'>
            {/* FIRSTNAME */}
            <div className='mb-4 w-full'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='firstname'
              >
                First Name:
              </label>
              <input
                type='text'
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                name='firstname'
                value={firstname}
                onChange={(e) => {
                  onChange(e);
                }}
                placeholder='Enter your first name'
              />
            </div>
            {/* LASTNAME */}
            <div className='mb-4 w-full'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='lastname'
              >
                Lastname:
              </label>
              <input
                type='text'
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                name='lastname'
                value={lastname}
                onChange={(e) => {
                  onChange(e);
                }}
                placeholder='Enter your last name'
              />
            </div>
          </div>

          {/* CONTACT NUMBER */}
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='contactNumber'
            >
              Contact Number
            </label>
            <input
              type='number'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              name='contactNumber'
              value={contactNumber}
              onChange={(e) => {
                onChange(e);
              }}
              placeholder='Contact Number'
            />
          </div>

          {/* ADDRESS */}
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='address'
            >
              Address:
            </label>
            <input
              type='text'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              name='address'
              value={address}
              onChange={(e) => {
                onChange(e);
              }}
              placeholder='Input your full address'
            />
          </div>

          {/* EMAIL */}
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='email'
            >
              Email:
            </label>
            <input
              type='email'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              name='email'
              value={email}
              onChange={(e) => {
                onChange(e);
              }}
              placeholder='Input your email address'
            />
          </div>

          {/* USERNAME */}
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='username'
            >
              Username
            </label>
            <input
              type='text'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              name='username'
              value={username}
              onChange={(e) => {
                onChange(e);
              }}
              placeholder='Choose a username you want'
            />
          </div>

          {/* PASSWORD */}
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='password'
            >
              Password
            </label>
            <input
              type='password'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              name='password'
              value={password}
              onChange={(e) => {
                onChange(e);
              }}
              placeholder='*************'
            />
          </div>
          <button
            type='submit'
            className='w-full text-center py-3 rounded bg-blue-500 text-white hover:bg-blue-700 focus:outline-none my-1'
          >
            Create Account
          </button>

          <div className='text-center'>
            <span className='text-xs text-gray-400 font-semibold'>
              Don't have account?
            </span>
            <a
              href='http://localhost:3000/login'
              className='text-xs font-semibold text-blue-700'
            >
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
