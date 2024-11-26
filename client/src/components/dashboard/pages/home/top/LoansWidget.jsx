import { CreditScore } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';

export default function LoansWidget() {
  const [loans, setLoans] = useState([]);
  const [gross, setGross] = useState([]);
  const [total, setTotal] = useState(0);

  const getLoans = async () => {
    try {
      const response = await fetch('http://localhost:8000/allLoans', {
        method: 'GET',
        headers: { Authorization: localStorage.getItem('token') },
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

  useEffect(() => {
    getLoans();
  }, []);

  useEffect(() => {
    setTotal(gross.reduce((a, b) => a + b, 0));
  }, [gross]);

  return (
    <div className=' px-4 sm:px-6 lg:px-8'>
      {/* Loans */}
      <div
        className='mt-5 p-6 sm:p-8 rounded-xl cursor-pointer border border-t-4 border-t-blue-500 hover:bg-blue-500
        hover:text-white hover:text-base transition duration-150 ease-in-out shadow-md
        flex flex-col items-center sm:items-start text-center sm:text-left'
      >
        <span className='text-lg sm:text-xl font-semibold'>Loans</span>
        <div className='my-3 flex items-center justify-center sm:justify-start'>
          <CreditScore className='mr-2 text-xl sm:text-2xl' />
          <span className='text-3xl sm:text-4xl'>
            ₹ {new Intl.NumberFormat().format(total)}
          </span>
        </div>
        <span className='text-base sm:text-lg'>Total Loans Transactions</span>
      </div>
    </div>
  );
}
