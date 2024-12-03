import React, { useState, useEffect } from 'react';
import { PermIdentity, CreditScore, ReceiptLong } from '@mui/icons-material';

export default function TopWidget() {
  const [clients, setClients] = useState([]);
  const [loans, setLoans] = useState([]);
  const [gross, setGross] = useState([]);
  const [totalLoan, setTotalLoan] = useState(0);
  const [payments, setPayments] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  // Fetch Clients
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

  // Fetch Loans
  const getLoans = async () => {
    try {
      const response = await fetch('http://localhost:8000/allLoans', {
        method: 'GET',
        headers: { Authorization: getCookie('token') },
      });

      const parseRes = await response.json();
      setLoans(parseRes);

      setGross(
        parseRes.map((loan) => {
          return Number(loan.gross_loan);
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Payments
  const getPayments = async () => {
    try {
      const response = await fetch('http://localhost:8000/allPayments', {
        method: 'GET',
        headers: { Authorization: getCookie('token') },
      });

      const parseRes = await response.json();
      setPayments(parseRes);

      setAmounts(
        parseRes.map((payment) => {
          return Number(payment.amount);
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Calculating Total Loan
  useEffect(() => {
    setTotalLoan(gross.reduce((acc, val) => acc + val, 0));
  }, [gross]);

  // Calculating Total Payment
  useEffect(() => {
    setTotalPayment(amounts.reduce((acc, val) => acc + val, 0));
  }, [amounts]);

  // Initialize fetch
  useEffect(() => {
    getClients();
    getLoans();
    getPayments();
  }, []);

  return (
    <div className='w-full justify-between flex flex-col sm:flex-row gap-5 sm:gap-5 lg:gap-7 xl:gap-4 p-5'>
      {/* Clients Widget */}
      <div className='w-full sm:w-1/3 lg:w-1/3'>
        <div className='mt-5 p-6 sm:p-8 rounded-xl cursor-pointer border border-t-4 border-t-blue-500 hover:bg-blue-500 hover:text-white hover:text-base transition duration-150 ease-in-out shadow-md flex flex-col items-center sm:items-start text-center sm:text-left'>
          
            <span className='text-lg sm:text-xl font-semibold'>Borrowers</span>
          
          <div className='my-3 flex items-center space-x-2'>
            <PermIdentity fontSize='large' />
            <span className='text-3xl sm:text-4xl'>{clients.length}</span>
          </div>
          <span className='text-base sm:text-lg'>Total Clients Serviced</span>
        </div>
      </div>

      {/* Loans Widget */}
      <div className='w-full sm:w-1/3 lg:w-1/3'>
        <div className='mt-5 p-6 sm:p-8 rounded-xl cursor-pointer border border-t-4 border-t-blue-500 hover:bg-blue-500 hover:text-white hover:text-base transition duration-150 ease-in-out shadow-md flex flex-col items-center sm:items-start text-center sm:text-left'>
          <span className='text-lg sm:text-xl font-semibold'>Loans</span>
          <div className='my-3 flex items-center justify-center sm:justify-start'>
            <CreditScore className='mr-2 text-xl sm:text-2xl' />
            <span className='text-3xl sm:text-4xl'>
              ₹ {new Intl.NumberFormat().format(totalLoan)}
            </span>
          </div>
          <span className='text-base sm:text-lg'>Total Loans Transactions</span>
        </div>
      </div>

      {/* Payments Widget */}
      <div className='w-full sm:w-1/3 lg:w-1/3'>
        <div className='mt-5 p-6 sm:p-8 rounded-xl cursor-pointer border border-t-4 border-t-blue-500 hover:bg-blue-500 hover:text-white hover:text-base transition duration-150 ease-in-out shadow-md flex flex-col items-center sm:items-start text-center sm:text-left'>
          <span className='text-lg sm:text-xl font-semibold'>Payments</span>
          <div className='my-3 flex items-center justify-center sm:justify-start'>
            <ReceiptLong className='mr-2 text-xl sm:text-2xl' />
            <span className='text-3xl sm:text-4xl'>
              ₹ {new Intl.NumberFormat().format(totalPayment)}
            </span>
          </div>
          <span className='text-base sm:text-lg'>Total Payments Collected</span>
        </div>
      </div>
    </div>
  );
}
