import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DeleteForever} from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import LogoutButton from '../../../LogoutButton';

import Sidebar from '../../../sidebar/Sidebar';

const Payments = ({ setAuth }) => {
  const [payments, setPayments] = useState([]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  

  const GetPayments = async () => {
    try {
      const response = await fetch('http://localhost:8000/allPayments', {
        method: 'GET',
        headers: { Authorization: getCookie('token') },
      });

      // Check if the response is OK (status 200)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const parseRes = await response.json(); // Parse only if the response is valid
      setPayments(parseRes);
      console.log(parseRes);
    } catch (error) {
      console.error(`Error fetching payments: ${error.message}`);
    }
  };


  // Delete payment Function

  const deleteNotif = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      }),
      {
        pending: 'Deleting Payment...',
        success: 'Deleted Succesfully!',
        error: 'Error!',
      },
      {
        autoClose: 2000,
      }
    );
  };
  

  async function deletePayment(id) {
    try {
      await fetch(`http://localhost:8000/loans/${id}`, {
        method: 'DELETE',
        headers: { Authorization: getCookie('token') },
      });
      deleteNotif();
      setTimeout(() => {
        setPayments(payments.filter((payment) => payment.id !== id));
      }, 2000);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    GetPayments();
  }, []);

  return (
    <div className='flex  h-full'>
      <ToastContainer />
      {/* PAYMENTS */}
      <div className='w-full h-[900px] mx-auto px-8 py-8 mb-4 border bg-white shadow-md rounded'>
        {/* HEADER */}
        <div className='flex items-center justify-between px-4 py-5 sm:px-6 bg-blue-500 rounded shadow-md '>
          <div className='text-sm md:text-md text-white pl-2'>
            <Sidebar />
          </div>
          <div className='flex-grow px-4 text-center'>
            <h3 className='text-lg font-medium text-white'>Payments Report</h3>
            <p className='text-sm text-white'>Summary of Collections and information.</p>
          </div>

          {/* BUTTON */}

          <div className='text-white'>
            {/* Logout Button */}
            <LogoutButton setAuth={setAuth} />
          </div>
        </div>

        {/* TITLE */}
        <div className='flex items-center justify-between border-y-2 mt-5'>
          <h3 className='text-lg font-medium leading-6 text-gray my-2  px-1 py-2 '>
            Payment Transactions
          </h3>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 rounded focus:outline-none focus:shadow-outline w-auto mt-2'>
            <Link to='/borrowers'>Add Payment</Link>
          </button>
        </div>

        <div className='w-full h-[650px] px-4 overflow-auto hover:overflow-scroll mt-5 border rounded shadow-md border-t-4 border-t-blue-500'>
          <table className='table-fixed text-center '>
            <thead>
              <tr>
                <th className='w-1/1 px-1 py-2 text-gray-600'>ID</th>
                <th className='w-1/6 px-1 py-2 text-gray-600'>Client Name</th>
                <th className='w-1/1 px-1 py-2 text-gray-600'>Voucher ID</th>
                <th className='w-1/6 px-1 py-2 text-gray-600'>Amount</th>
                <th className='w-1/6 px-1 py-2 text-gray-600'>Collection Date</th>
                <th className='w-1/6 px-1 py-2 text-gray-600'>Collected By:</th>
                <th className='w-1/6 px-1 py-2 text-gray-600'>New Balance</th>
                <th className='w-1/6 px-4 py-2 text-gray-600'>Method</th>
                <th className='w-1/6 px-4 py-2 text-gray-600'>Delete</th>
              </tr>
            </thead>
            <tbody>
              {payments.length <= 0 ? (
                <tr className='border px-4 py-2 bg-blue-50'>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className='px-4 py-2 bg-blue-50'>No Payment</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ) : (
                payments.map((payment, index) => {
                  return (
                    <tr key={index}>
                      <td className='border px-4 py-2 bg-gray-50'>
                        {payment.id}
                      </td>
                      <td className='border px-4 py-2'>
                        {payment.firstname + ' ' + payment.lastname}
                      </td>
                      <td className='border px-4 py-2  bg-gray-50'>
                        {' '}
                        {payment.loan_id}
                      </td>
                      <td className='border px-4 py-2 '>₹ {payment.amount}</td>
                      <td className='border px-4 py-2  bg-gray-50'>
                        {new Date(payment.collection_date).toDateString()}
                      </td>
                      <td className='border px-4 py-2 '>
                        {payment.collected_by}
                      </td>
                      <td className='border px-4 py-2  bg-gray-50'>
                        ₹ {payment.new_balance}
                      </td>
                      <td className='border px-4 py-2 '>
                        {payment.method === 'ATM' ? (
                          <span className=' bg-green-500 text-white px-4 py-1 rounded-md'>
                            {payment.method}
                          </span>
                        ) : payment.method === 'OTC' ? (
                          <span className=' bg-yellow-300 text-white px-4 py-1 rounded-md'>
                            {payment.method}
                          </span>
                        ) : payment.method === 'ONLINE BANK' ? (
                          <span className=' bg-orange-300 text-white px-4 py-1 rounded-md'>
                            {payment.method}
                          </span>
                        ) : (
                          <span className=' bg-blue-500 text-white px-4 py-1 rounded-md'>
                            {payment.method}
                          </span>
                        )}
                      </td>
                      <td className='border px-4 py-2'>
                        <button
                          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full text-sm'
                          onClick={() => deletePayment(payment.id)}
                        >
                          <DeleteForever className='text-lg' />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
