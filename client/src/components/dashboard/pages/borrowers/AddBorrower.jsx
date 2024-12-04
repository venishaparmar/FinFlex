import { Logout } from '@mui/icons-material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../../sidebar/Sidebar';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddBorrower = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    firstname: '',
    lastname: '',
    contactNumber: '',
    address: '',
    email: '',
    username: '',
  });

  const { firstname, lastname, contactNumber, address, email, username } = inputs;

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Function to handle changes with validation
  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === 'firstname' || name === 'lastname') {
      // Allow only alphabets
      if (/^[A-Za-z]*$/.test(value) || value === '') {
        setInputs({ ...inputs, [name]: value });
      }
    } else if (name === 'contactNumber') {
      // Allow only 10 digits
      if (/^\d{0,10}$/.test(value)) {
        setInputs({ ...inputs, [name]: value });
      }
    } else if (name === 'address') {
      // Allow alphabets, numbers, spaces, and common punctuation
      if (/^[A-Za-z0-9\s,.'-]*$/.test(value) || value === '') {
        setInputs({ ...inputs, [name]: value });
      }
    } else {
      // Default case for email and username
      setInputs({ ...inputs, [name]: value });
    }
  };

  const validateEmail = (email) => {
    // Basic email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addSuccessful = () => {
    toast.success('Borrower added successfully!', { autoClose: 2000 });
  };

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    // Validation before submission
    if (!validateEmail(email)) {
      toast.error('Invalid email format.');
      return;
    }
    if (contactNumber.length !== 10) {
      toast.error('Contact number must be 10 digits.');
      return;
    }

    try {
      const body = { firstname, lastname, contactNumber, address, email, username };

      const response = await fetch('http://localhost:8000/addClient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getCookie('token'),
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        addSuccessful();
        setTimeout(() => navigate('/borrowers'), 3000);
      } else {
        const parseRes = await response.json();
        toast.error(parseRes.error || 'Failed to add borrower.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Server error');
    }
  };

  return (
    <div className='flex h-[900px]'>
      <div className='w-full h-[900px] border bg-white shadow-md rounded'>
        <div className='w-full px-8 pt-6 pb-8 mb-4 bg-white rounded'>
          {/* HEADER */}
          <div className='flex items-center justify-between px-4 py-5 sm:px-6 bg-blue-500 rounded shadow-md'>
            <div className='text-white'>
              <Sidebar />
            </div>
            <div className='flex-grow px-4 text-center'>
              <h3 className='text-lg font-medium text-white'>Add New Borrower</h3>
              <p className='text-sm text-white'>Register all the required fields.</p>
            </div>
            <div className='text-white'>
              <button onClick={() => setAuth(false)}>
                <Link to='/login'>
                  <Logout />
                </Link>
              </button>
            </div>
          </div>

          <form onSubmit={onSubmit} className='mt-5 p-8 rounded border shadow-md border-t-4 border-t-blue-500'>
            {/* FIRST NAME */}
            <label htmlFor='firstname'>First Name:</label>
            <input
              type='text'
              name='firstname'
              value={firstname}
              onChange={onChange}
              placeholder='First Name'
              className='block border border-grey-500 w-full p-3 rounded mb-4'
              required
            />
            {/* LAST NAME */}
            <label htmlFor='lastname'>Last Name:</label>
            <input
              type='text'
              name='lastname'
              value={lastname}
              onChange={onChange}
              placeholder='Last Name'
              className='block border border-grey-500 w-full p-3 rounded mb-4'
              required
            />
            {/* CONTACT NUMBER */}
            <label htmlFor='contactNumber'>Contact Number:</label>
            <input
              type='tel'
              name='contactNumber'
              value={contactNumber}
              onChange={onChange}
              placeholder='Contact Number'
              className='block border border-grey-500 w-full p-3 rounded mb-4'
              required
            />
            {/* ADDRESS */}
            <label htmlFor='address'>Address:</label>
            <input
              type='text'
              name='address'
              value={address}
              onChange={onChange}
              placeholder='Address'
              className='block border border-grey-500 w-full p-3 rounded mb-4'
              required
            />
            {/* EMAIL */}
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              name='email'
              value={email}
              onChange={onChange}
              placeholder='Email'
              className='block border border-grey-500 w-full p-3 rounded mb-4'
              required
            />
            {/* USERNAME */}
            <label htmlFor='username'>Username:</label>
            <input
              type='text'
              name='username'
              value={username}
              onChange={onChange}
              placeholder='Username'
              className='block border border-grey-500 w-full p-3 rounded mb-4'
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
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default AddBorrower;
