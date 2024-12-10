import React, { useState } from 'react';
import { useEffect } from 'react';
import Sidebar from '../../../sidebar/Sidebar';
import { DeleteForever, Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import LogoutButton from '../../../LogoutButton';

const Loans = ({ setAuth }) => {
  const [loans, setLoans] = useState([]);

  const GetLoans = async () => {
    try {
      const response = await fetch('http://localhost:8000/allLoans/', {
        method: 'GET',
        headers: { Authorization: getCookie('token') },
      });

      const parseRes = await response.json();

      setLoans(parseRes);
      // console.log(parseRes);
    } catch (error) {
      console.log(error.message);
    }
  };

  // DELETE LOAN FUNCTION
  const deleteNotif = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      }),
      {
        pending: 'Deleting Loan...',
        success: 'Deleted Succesfully!',
        error: 'Error!',
      },
      {
        autoClose: 2000,
      }
    );
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  async function deleteLoan(id) {
    try {
      await toast.promise(
        new Promise(async (resolve, reject) => {
          const response = await fetch(`http://localhost:8000/loans/${id}`, {
            method: 'DELETE',
            headers: { Authorization: getCookie('token') },
          });


          if (!response.ok) {
            const errorMessage = `Failed to delete loan as it has payment history`;
            toast.error(errorMessage, { autoClose: 2000 });
            reject(new Error(errorMessage));
            return;
          }

          // If successful, resolve the promise
          resolve();

          // Update state and UI
          setLoans(loans.filter((loan) => loan.id !== id));
        }),
        {
          pending: 'Deleting Loan...',
          success: 'Loan deleted successfully!',
          error: 'Error while deleting loan!',
        },
        {
          autoClose: 2000,
        }
      );
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    GetLoans();
  }, []);

  return (
    <div className='flex  h-full '>
      <ToastContainer />
      {/* <GetAllLoans /> */}
      <div className='flex w-full'>
        {/* Loans Information */}
        <div className='w-full h-full mx-auto px-8 py-8 mb-4 border bg-white shadow-md rounded '>
          {/* HEADER */}
          <div className='flex items-center justify-between px-4 py-5 sm:px-6 bg-blue-500 rounded shadow-md '>
            {/* TITLE */}
            <div className='text-sm md:text-md text-white pl-2'>
              <Sidebar />
            </div>
            <div className='flex-grow px-4 text-center'>
              <h3 className='text-lg font-medium text-white'>Loans Report</h3>
              <p className='text-sm text-white'>Loans summary and informations.</p>
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
              Loan Transactions
            </h3>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 rounded focus:outline-none focus:shadow-outline w-auto mt-2'>
              <Link to='/addLoan'>Add Loan</Link>
            </button>
          </div>

          {/* ALL LOANS */}
          <div className='w-full h-[650px] px-4 overflow-auto hover:overflow-scroll mt-5 border rounded shadow-md border-t-4 border-t-blue-500 '>
            <table className='table-fixed text-center  '>
              <thead>
                <tr>
                  <th className='w-1/1 px-1 py-2 text-gray-600'>Voucher</th>
                  <th className='w-1/6 px-1 py-2 text-gray-600'>Client Name</th>
                  <th className='w-1/6 px-1 py-2 text-gray-600'>Loan Type</th>
                  <th className='w-1/6 px-1 py-2 text-gray-600'>
                    Outstanding Balance
                  </th>
                  <th className='w-1/6 px-4 py-2 text-gray-600'>Gross Loan</th>
                  <th className='w-1/6 px-4 py-2 text-gray-600'>
                    Amortization
                  </th>
                  <th className='w-1/6 px-4 py-2 text-gray-600'>Terms</th>
                  <th className='w-1/6 px-4 py-2 text-gray-600'>
                    Date Released
                  </th>
                  <th className='w-1/6 px-4 py-2 text-gray-600'>Status</th>
                  <th className='w-1/1 px-4 py-2 text-gray-600'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.length <= 0 ? (
                  <tr className='border px-4 py-2 bg-blue-50'>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className='px-4 py-2 bg-blue-50'>No Loan Data</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ) : (
                  loans.map((loan, index) => {
                    return (
                      <tr key={index}>
                        <td className='border px-4 py-2 bg-gray-50'>
                          {loan.id}
                        </td>
                        <td className='border px-4 py-2'>
                          {loan.firstname + ' ' + loan.lastname}
                        </td>
                        <td className='border px-4 py-2  bg-gray-50'>
                          {loan.type}
                        </td>
                        <td className='border px-4 py-2 '>₹ {loan.balance}</td>
                        <td className='border px-4 py-2  bg-gray-50'>
                          ₹ {loan.gross_loan}
                        </td>
                        <td className='border px-4 py-2 '>₹ {loan.amort}</td>
                        <td className='border px-4 py-2  bg-gray-50'>
                          {loan.terms} month/s
                        </td>
                        <td className='border px-4 py-2 '>
                          {new Date(loan.date_released).toDateString()}
                        </td>
                        <td className='border px-4 py-2  bg-gray-50'>
                          {/* <span className='border bg-green-600 text-white px-5 py-1 rounded-md'>
                            {loan.status}
                          </span> */}
                          {loan.status === 'Approved' ||
                            loan.status === 'Fully Paid' ||
                            loan.status === 'Disbursed' ? (
                            <span className=' bg-green-500 text-white px-4 py-1 rounded-md whitespace-nowrap'>
                              {loan.status}
                            </span>
                          ) : loan.status === 'Declined' ? (
                            <span className=' bg-blue-400 text-white px-4 py-1 rounded-md whitespace-nowrap'>
                              {loan.status}
                            </span>
                          ) : (
                            <span className=' bg-yellow-300 text-white px-4 py-1 rounded-md whitespace-nowrap'>
                              {loan.status}
                            </span>
                          )}
                        </td>
                        <td className='border px-4 py-2'>
                          <button
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 rounded focus:outline-none focus:shadow-outline w-full text-sm'
                            onClick={() => deleteLoan(loan.id)}
                          >
                            <DeleteForever className='text-lg' />
                          </button>
                          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full '>
                            <Link to={`/editLoan/${loan.id}`}>
                              <Edit className='text-sm' />
                            </Link>
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
    </div>
  );
};

export default Loans;
