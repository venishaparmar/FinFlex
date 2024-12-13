import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../sidebar/Sidebar';
import LogoutButton from '../../LogoutButton';

const AddAdmin = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    firstname: '',
    lastname: '',
    email: '',
    address: '',
    username: '',
    password: '',
    contactNumber: '',
  });

  const [errors, setErrors] = useState({});

  const {
    firstname,
    lastname,
    contactNumber,
    address,
    email,
    username,
    password,
  } = inputs;

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

  

  const addSuccessful = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
      {
        pending: 'Adding New Admin...',
        success: 'Added Successfully!',
        error: 'Error!',
      },
      {
        autoClose: 1000,
      }
    );
  };
  const validateEmail = (email) => {
    // Basic email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation before submission
    if (!validateEmail(email)) {
      console.error('Invalid email format.');
      return;
    }
    if (contactNumber.length !== 10) {
      console.error('Contact number must be 10 digits.');
      return;
    }

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

      const response = await fetch('http://localhost:8000/addAdmin', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      if (response.ok) {
        addSuccessful();
        setTimeout(() => {
          navigate(-1);
        }, 3000);
      } else {
        toast.error(parseRes.message || 'Error adding admin.');
      }
    } catch (error) {
      console.error(error.message);
      toast.error('An unexpected error occurred.');
    }
  };

  return (
    <div className='flex h-full '>
      <ToastContainer />

      <div className='w-full h-full border bg-white shadow-md rounded'>
        <div className='w-full px-8 pt-6 pb-8 mb-4 bg-white rounded '>
          <div className='flex items-center justify-between px-4 py-5 sm:px-6 bg-blue-500 rounded shadow-md '>
            <div className='text-white'>
              <Sidebar />
            </div>
            <div className='flex-grow px-4 text-center'>
              <h3 className='text-lg font-medium text-white'>Add New Admin</h3>
              <p className='text-sm text-white'>Register all the required fields.</p>
            </div>
            <ToastContainer />
            <div className='text-white'>
              <LogoutButton setAuth={setAuth} />
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className='mt-5 p-8 rounded border shadow-md border-t-4 border-t-blue-500'
          >
            <label htmlFor='firstname'>First Name: </label>
            <input
              type='text'
              className={`block border border-grey-500 w-full p-3 rounded mb-4 ${
                errors.firstname && 'border-red-500'
              }`}
              name='firstname'
              value={firstname}
              onChange={onChange}
              placeholder='First Name'
            />
            {errors.firstname && <p className='text-red-500'>{errors.firstname}</p>}

            <label htmlFor='lastname'>Last Name: </label>
            <input
              type='text'
              className={`block border border-grey-500 w-full p-3 rounded mb-4 ${
                errors.lastname && 'border-red-500'
              }`}
              name='lastname'
              value={lastname}
              onChange={onChange}
              placeholder='Last Name'
            />
            {errors.lastname && <p className='text-red-500'>{errors.lastname}</p>}

            <label htmlFor='contactNumber'>Contact Number: </label>
            <input
              type='text'
              className={`block border border-grey-500 w-full p-3 rounded mb-4 ${
                errors.contactNumber && 'border-red-500'
              }`}
              name='contactNumber'
              value={contactNumber}
              onChange={onChange}
              placeholder='Contact Number'
            />
            {errors.contactNumber && <p className='text-red-500'>{errors.contactNumber}</p>}

            <label htmlFor='address'>Address: </label>
            <input
              type='text'
              className={`block border border-grey-500 w-full p-3 rounded mb-4 ${
                errors.address && 'border-red-500'
              }`}
              name='address'
              value={address}
              onChange={onChange}
              placeholder='Address'
            />
            {errors.address && <p className='text-red-500'>{errors.address}</p>}

            <label htmlFor='email'>Email Address: </label>
            <input
              type='email'
              className={`block border border-grey-500 w-full p-3 rounded mb-4 ${
                errors.email && 'border-red-500'
              }`}
              name='email'
              value={email}
              onChange={onChange}
              placeholder='Email'
            />
            {errors.email && <p className='text-red-500'>{errors.email}</p>}

            <label htmlFor='password'>Password: </label>
            <input
              type='password'
              className={`block border border-grey-500 w-full p-3 rounded mb-4 ${
                errors.password && 'border-red-500'
              }`}
              name='password'
              value={password}
              onChange={onChange}
              placeholder='**********'
            />
            {errors.password && <p className='text-red-500'>{errors.password}</p>}

            <label htmlFor='username'>Username: </label>
            <input
              type='text'
              className={`block border border-grey-500 w-full p-3 rounded mb-4 ${
                errors.username && 'border-red-500'
              }`}
              name='username'
              value={username}
              onChange={onChange}
              placeholder='Username'
            />
            {errors.username && <p className='text-red-500'>{errors.username}</p>}
            <div className='flex flex-col sm:flex-row sm:justify-start'>
              <button
                type='submit'
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2 sm:mb-0 sm:mr-4 w-full sm:w-auto'
              >
                Save
              </button>
              <Link to='/admin' className='w-full sm:w-auto'>
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

export default AddAdmin;
