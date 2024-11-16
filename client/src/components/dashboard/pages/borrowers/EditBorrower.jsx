import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logout } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';

import Sidebar from '../../../sidebar/Sidebar';

const EditBorrower = ({ setAuth }) => {
  const location = useLocation();

  const clientId = location.pathname.split('/')[2];
  const GetClient = async () => {
    try {
      const response = await fetch(`http://localhost:8000/client/${clientId}`, {
        method: 'GET',
        headers: { Authorization: localStorage.getItem('token') },
      });

      const parseRes = await response.json();

      setInputs({
        firstname: parseRes.firstname,
        lastname: parseRes.lastname,
        contactNumber: parseRes.contactnumber,
        email: parseRes.email,
        address: parseRes.address,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const [inputs, setInputs] = useState({
    firstname: '',
    lastname: '',
    contactNumber: '',
    email: '',
    address: '',
  });

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const { firstname, lastname, contactNumber, address, email } = inputs;

  const addSuccessful = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
      {
        pending: 'Updating Borrower...',
        success: 'Updated Succesfully!',
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
      const body = {
        firstname,
        lastname,
        contactNumber,
        address,
        email,
      };

      const response = await fetch(
        `http://localhost:8000/clients/${clientId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
          body: JSON.stringify(body),
        }
      );

      const parseRes = await response.json();

      // console.log(parseRes);

      addSuccessful();

      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    GetClient();
  }, []);

  return (
    <div className='flex h-[900px]'>
      <Sidebar />
      <ToastContainer />

      <div className='w-full h-[900px] mx-auto px-8 py-8 mb-4 border bg-white shadow-md rounded'>
        <div className='w-full px-8 pt-6 pb-8 mb-4 bg-white  rounded'>
          {/* HEADER */}

          <div className='flex items-center justify-between px-4 py-5 sm:px-6 bg-red-500 rounded shadow-md '>
            {/* TITLE */}
            <div>
              <h3 className='text-lg font-medium leading-6 text-white'>
                Update Borrower #{clientId}
              </h3>
              <p className='mt-1 max-w-2xl text-sm text-white'>
                Update all the required fields.
              </p>
            </div>

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

          {/* FORM */}
          <form
            onSubmit={(e) => {
              onSubmit(e);
            }}
            className='mt-5 p-8 h-[650px] rounded border shadow-md border-t-4 border-t-red-500 '
          >
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
            <button
              type='submit'
              className=' text-center py-3 rounded bg-red-500 text-white hover:bg-red-700 focus:outline-none my-1 w-1/5'
            >
              Update
            </button>
            <button className=' ml-5 text-center py-3 rounded bg-red-500 text-white hover:bg-red-700 focus:outline-none my-1 w-1/5'>
              <Link to={`/borrower/${clientId}`}>Back</Link>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBorrower;
