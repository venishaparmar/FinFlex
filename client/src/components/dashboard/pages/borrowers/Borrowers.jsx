import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DeleteForever, VisibilityOutlined } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import LogoutButton from '../../../LogoutButton';

import Sidebar from '../../../sidebar/Sidebar';

const Borrowers = ({ setAuth }) => {
  const [clients, setClients] = useState([]);

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

  const deleteNotif = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => resolve(), 2000);
      }),
      {
        pending: 'Deleting Client...',
        success: 'Deleted Successfully!',
        error: 'Error!',
      },
      { autoClose: 2000 }
    );
  };

  async function deleteClient(id) {
    try {
      await fetch(`http://localhost:8000/clients/${id}`, {
        method: 'DELETE',
        headers: { Authorization: getCookie('token') },
      });
      deleteNotif();
      setTimeout(() => {
        setClients(clients.filter((loan) => loan.id !== id));
      }, 2000);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getClients();
  }, []);

  return (
    <div className='h-full'>
    <div className='text-gray-900 h-auto flex flex-col lg:flex-row'>
      <ToastContainer />
      <div className='w-full mx-auto px-4 py-4 bg-white border shadow-md rounded-lg overflow-hidden'>
        {/* HEADER */}
        <div className='flex flex-col md:flex-row items-center justify-between p-5 bg-blue-500 rounded shadow-md'>
          <div className='text-sm md:text-md text-white mb-2 md:mb-0'>
            <Sidebar />
          </div>
          <div className='flex-grow px-4 text-center'>
            <h3 className='text-lg font-medium text-white'>Borrowers</h3>
            <p className='text-sm text-white'>All clients registered</p>
          </div>
          <div className='text-white'>
            {/* Logout Button */}
            <LogoutButton setAuth={setAuth} />
          </div>
        </div>

        {/* TITLE */}
        <div className='flex flex-col sm:flex-row items-center justify-between border-y-2 mt-5'>
          <h3 className='text-lg mx-2 font-medium leading-6 text-gray-700 mb-2 sm:mb-0'>
            Borrowers' List
          </h3>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none mb-2 sm:mb-0'>
            <Link to='/addBorrower'>Add Borrower</Link>
          </button>
        </div>

        {/* INFO */}
        <div className='w-full mt-5 overflow-x-auto'>
          <table className='w-full text-center mb-4'>
            <thead className='bg-gray-100'>
              <tr>
                {['ID', 'Full Name', 'Contact Number', 'Address', 'Email', 'Action'].map((header) => (
                  <th key={header} className='px-4 py-2 text-gray-600 text-sm md:text-md'>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan='6' className='px-4 py-4 text-gray-500'>
                    No Client Data
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className='border-b hover:bg-gray-50'>
                    <td className='px-4 py-2'>{client.id}</td>
                    <td className='px-4 py-2'>{`${client.firstname} ${client.lastname}`}</td>
                    <td className='px-4 py-2'>{client.contactnumber}</td>
                    <td className='px-4 py-2'>{client.address}</td>
                    <td className='px-4 py-2'>{client.email}</td>
                    <td className='px-4 py-2'>
                      <div className='flex flex-col md:flex-row gap-2 justify-center'>
                        <button
                          className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded flex items-center justify-center'
                          onClick={() => deleteClient(client.id)}
                        >
                          <DeleteForever />
                        </button>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded flex items-center justify-center'>
                          <Link to={`/Borrower/${client.id}`}>
                            <VisibilityOutlined />
                          </Link>
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
    </div>
  );
};

export default Borrowers;
