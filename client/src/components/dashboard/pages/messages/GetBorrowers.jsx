import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, VisibilityOutlined } from '@mui/icons-material';
import Message from './Message';

const GetBorrowers = ({ setAuth }) => {
  const [clients, setClients] = useState([]);
  const [emails, setEmail] = useState('');

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const getClients = async () => {
    try {
      const response = await fetch('http://localhost:8000/allClients', {
        method: 'GET',
        headers: { Authorization: getCookie('token') },
      });
      const parseRes = await response.json();
      setClients(parseRes);
    } catch (error) {
      console.log(error);
    }
  };

  async function selectClient(email) {
    try {
      await fetch(`http://localhost:8000/email/${email}`, {
        method: 'GET',
        headers: { Authorization: localStorage.getItem('token') },
      });
      setEmail(email);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getClients();
  }, []);

  return (
    <div className='text-gray-900 px-4'>
      {/* ALL CLIENT CONTACT INFO */}
      <div className='w-full'>
        {/* TITLE */}
        <div className='flex items-center justify-between border-y-2 mt-5'>
          <h3 className='text-lg font-medium leading-6 text-gray my-2 px-1 py-2'>
            Clients Contact Info
          </h3>
        </div>
        {/* INFO */}
        <div className='w-full max-h-[650px] px-4 overflow-auto hover:overflow-scroll mt-5 border rounded shadow-md border-t-4 border-t-blue-500'>
          <div className='overflow-x-auto'>
            <table className='table-auto text-center w-full min-w-[600px]'>
              <thead>
                <tr>
                  <th className='w-1/6 px-1 py-2 text-gray-600'>ID</th>
                  <th className='w-1/6 px-1 py-2 text-gray-600'>Full Name</th>
                  <th className='w-1/6 px-1 py-2 text-gray-600'>Contact Number</th>
                  <th className='w-1/6 px-1 py-2 text-gray-600'>Address</th>
                  <th className='w-1/6 px-1 py-2 text-gray-600'>Email</th>
                  <th className='w-1/6 px-1 py-2 text-gray-600'>Action</th>
                </tr>
              </thead>
              <tbody>
                {clients.length <= 0 ? (
                  <tr className='border px-4 py-2 bg-blue-50'>
                    <td colSpan='6' className='px-4 py-2 bg-blue-50'>No Client Data</td>
                  </tr>
                ) : (
                  clients.map((client, index) => (
                    <tr key={index} className='break-words'>
                      <td className='border px-2 py-2 bg-gray-50'>{client.id}</td>
                      <td className='border px-2 py-2'>{client.firstname} {client.lastname}</td>
                      <td className='border px-2 py-2 bg-gray-50'>{client.contactnumber}</td>
                      <td className='border px-2 py-2 break-words'>{client.address}</td>
                      <td className='border px-2 py-2 bg-gray-50 break-words'>{client.email}</td>
                      <td className='border px-2 py-2'>
                        <div className='flex justify-center'>
                          <Link to={`/Borrower/${client.id}`} className='mr-2'>
                            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                              <VisibilityOutlined fontSize='small' />
                            </button>
                          </Link>
                          <button
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                            onClick={() => selectClient(client.email)}
                          >
                            <Check fontSize='small' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* EMAIL FORM */}
      <div className='w-full mt-10'>
        {/* TITLE */}
        <div className='flex items-center justify-between border-y-2 mt-5'>
          <h3 className='text-lg font-medium leading-6 text-gray my-2 px-1 py-2'>
            Email Form
          </h3>
        </div>
        <Message email={emails} />
      </div>
    </div>
  );
};

export default GetBorrowers;
