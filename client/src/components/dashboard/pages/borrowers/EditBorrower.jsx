import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logout } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import Sidebar from '../../../sidebar/Sidebar';

const EditBorrower = ({ setAuth }) => {
  const location = useLocation();
  const clientId = location.pathname.split('/')[2];

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const [inputs, setInputs] = useState({
    firstname: '',
    lastname: '',
    contactNumber: '',
    email: '',
    address: '',
  });

  const { firstname, lastname, contactNumber, address, email } = inputs;

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
      // Default case for email
      setInputs({ ...inputs, [name]: value });
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const GetClient = async () => {
    try {
      const response = await fetch(`http://localhost:8000/client/${clientId}`, {
        method: 'GET',
        headers: { Authorization: getCookie('token') },
      });

      const parseRes = await response.json();
      setInputs({
        firstname: parseRes.firstname,
        lastname: parseRes.lastname,
        contactNumber: parseRes.contactNumber,
        email: parseRes.email,
        address: parseRes.address,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const addSuccessful = () => {
    toast.success('Updated Successfully!', { autoClose: 2000 });
  };

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    // Validate email format
    if (!validateEmail(email)) {
      toast.error('Invalid email format.');
      return;
    }
    // Validate contact number length
    if (contactNumber.length !== 10) {
      toast.error('Contact number must be 10 digits.');
      return;
    }

    try {
      const body = { firstname, lastname, contactNumber, address, email };

      const response = await fetch(
        `http://localhost:8000/clients/${clientId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-type': 'application/json',
            Authorization: getCookie('token'),
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        addSuccessful();
        setTimeout(() => navigate(-1), 3000);
      } else {
        const parseRes = await response.json();
        toast.error(parseRes.error || 'Failed to update borrower.');
      }
    } catch (error) {
      console.log(error.message);
      toast.error('Server error');
    }
  };

  useEffect(() => {
    GetClient();
  }, []);

  return (
    <div className='flex h-full'>
      <ToastContainer />
      <div className='w-full h-full mx-auto px-2 py-2 mb-2 border bg-white shadow-md rounded'>
        <div className='w-full px-4 pt-4 pb-8 mb-4 bg-white rounded'>
          <div className='flex items-center justify-between px-4 py-5 sm:px-6 bg-blue-500 rounded shadow-md'>
            <Sidebar />
            <div className='flex-grow px-4 text-center'>
              <h3 className='text-lg font-medium text-white'>Update Borrower #{clientId}</h3>
              <p className='text-sm text-white'>Update all the required fields.</p>
            </div>
            <button
              className='text-white'
              onClick={() => setAuth(false)}
            >
              <Link to='/login'>
                <Logout />
              </Link>
            </button>
          </div>

          <form onSubmit={onSubmit} className='mt-5 p-8 h-full rounded border shadow-md border-t-4 border-t-blue-500'>
            <input
              type='text'
              name='firstname'
              value={firstname}
              onChange={onChange}
              placeholder='First Name'
              className='block border border-grey-500 w-full p-3 rounded mb-4'
              required
            />
            <input
              type='text'
              name='lastname'
              value={lastname}
              onChange={onChange}
              placeholder='Last Name'
              className='block border border-grey-500 w-full p-3 rounded mb-4'
              required
            />
            <input
              type='tel'
              name='contactNumber'
              value={contactNumber}
              onChange={onChange}
              placeholder='Contact Number'
              className='block border border-grey-500 w-full p-3 rounded mb-4'
              required
            />
            <input
              type='text'
              name='address'
              value={address}
              onChange={onChange}
              placeholder='Address'
              className='block border border-grey-500 w-full p-3 rounded mb-4'
              required
            />
            <input
              type='email'
              name='email'
              value={email}
              onChange={onChange}
              placeholder='Email'
              className='block border border-grey-500 w-full p-3 rounded mb-4'
              required
            />
            <button type="submit" className='bg-blue-500 text-white py-3 rounded hover:bg-blue-700 focus:outline-none sm:w-1/5 w-full'>
              Update
            </button>
            <button className='sm:ml-5 bg-blue-500 text-white py-3 rounded hover:bg-blue-700 focus:outline-none sm:w-1/5 w-full'>
              <Link to={`/borrower/${clientId}`}>Back</Link>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBorrower;
