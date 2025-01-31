import React, { useState, useEffect } from 'react';
import { useLocation} from 'react-router-dom';
import LogoutButton from '../../../LogoutButton';
import Sidebar from '../../../sidebar/Sidebar';
import AddPayments from './AddPayments';

const PaymentLoansInfo = ({ setAuth }) => {
  const [loans, setLoans] = useState([]);
  const location = useLocation();
  const clientId = location.pathname.split('/')[2];
  const loanId = location.pathname.split('/')[3];

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const GetLoans = async () => {
    try {
      const response = await fetch(`http://localhost:8000/loan/${loanId}`, {
        method: 'GET',
        headers: { Authorization: getCookie('token') },
      });

      const parseRes = await response.json();
      setLoans(parseRes);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    GetLoans();
  }, []);

  return (
    <div className='flex h-full'>
      <div className='w-full h-full mx-auto px-8 py-8 mb-4 border bg-white shadow-md rounded'>
        {/* HEADER */}
        <div className='flex items-center justify-between px-4 py-5 sm:px-6 bg-blue-500 rounded shadow-md '>
          {/* TITLE */}
          <div className='text-sm md:text-md text-white pl-2'>
            <Sidebar />
          </div>
          <div className='flex-grow px-4 text-center'>
            <h3 className='text-lg font-medium text-white'>Payment for Loan Voucher #{loanId}</h3>
            <p className='text-sm text-white'>Add a payment for a client</p>
          </div>

          {/* BUTTON */}
          <div className='text-white'>
            {/* Logout Button */}
            <LogoutButton setAuth={setAuth} />
          </div>
        </div>

        {/* Loans Information */}
        <div>
          {/* Loans Information */}
          <div className='mt-5 px-4 py-2 h-[180px] rounded border shadow-md border-t-4 border-t-blue-500 overflow-x-auto'>
            {/* Active Loans */}
            <div>
              <div className='flex items-center justify-between border-y-2 '>
                <h3 className='text-lg font-medium leading-6 text-gray my-2 px-1 py-2'>
                  Client's Loan
                </h3>
              </div>
              <div className='overflow-x-auto'>
                <table className='min-w-full text-center table-fixed'>
                  <thead>
                    <tr>
                      <th className='w-1/1 px-1 py-2 text-gray-600'>Voucher</th>
                      <th className='w-1/6 px-1 py-2 text-gray-600'>Loan Type</th>
                      <th className='w-1/6 px-1 py-2 text-gray-600'>Outstanding Balance</th>
                      <th className='w-1/6 px-4 py-2 text-gray-600'>Gross Loan</th>
                      <th className='w-1/6 px-4 py-2 text-gray-600'>Amortization</th>
                      <th className='w-1/6 px-4 py-2 text-gray-600'>Terms</th>
                      <th className='w-1/6 px-4 py-2 text-gray-600'>Date Released</th>
                      <th className='w-1/6 px-4 py-2 text-gray-600'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.length <= 0 ? (
                      <tr className='border px-4 py-2 bg-blue-50'>
                        <td colSpan='8' className='text-center px-4 py-2 bg-blue-50'>
                          No Loan Data
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td className='border px-4 py-2 bg-gray-50'>{loans.id}</td>
                        <td className='border px-4 py-2'>{loans.type}</td>
                        <td className='border px-4 py-2 bg-gray-50'>
                          ₹ {loans.balance}
                        </td>
                        <td className='border px-4 py-2 '>₹ {loans.gross_loan}</td>
                        <td className='border px-4 py-2 bg-gray-50'>
                          ₹ {loans.amort}
                        </td>
                        <td className='border px-4 py-2 '>{loans.terms} month/s</td>
                        <td className='border px-4 py-2 bg-gray-50'>
                          {new Date(loans.date_released).toDateString()}
                        </td>
                        <td className='border px-4 py-2 '>
                          {loans.status === 'Approved' ||
                            loans.status === 'Fully Paid' ? (
                            <span className='bg-green-500 text-white px-4 py-1 rounded-md whitespace-nowrap'>
                              {loans.status}
                            </span>
                          ) : loans.status === 'Declined' ? (
                            <span className='bg-blue-400 text-white px-4 py-1 rounded-md whitespace-nowrap'>
                              {loans.status}
                            </span>
                          ) : loans.status === 'Pending' ? (
                            <span className='bg-yellow-300 text-white px-4 py-1 rounded-md whitespace-nowrap'>
                              {loans.status}
                            </span>
                          ) : (
                            <span className='bg-orange-300 text-white px-4 py-1 rounded-md whitespace-nowrap'>
                              {loans.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <AddPayments loanId={loanId} balance={loans.balance} clientId={clientId} />
      </div>
    </div>
  );
};

export default PaymentLoansInfo;
