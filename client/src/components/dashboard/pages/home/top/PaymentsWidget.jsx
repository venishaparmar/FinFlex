import { ReceiptLong } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';

export default function PaymentsWidget() {
  const [payments, setPayments] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [total, setTotal] = useState(0);

  const getPayments = async () => {
    try {
      const response = await fetch('http://localhost:8000/allPayments', {
        method: 'GET',
        headers: { Authorization: localStorage.getItem('token') },
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

  useEffect(() => {
    getPayments();
  }, []);

  useEffect(() => {
    setTotal(amounts.reduce((acc, val) => acc + val, 0));
  }, [amounts]);

  return (
    <div className=' px-4 sm:px-6 lg:px-8'>
      {/* Payments */}
      <div
        className='mt-5 p-6 sm:p-8 rounded-xl cursor-pointer border border-t-4 border-t-blue-500 hover:bg-blue-500
        hover:text-white hover:text-base transition duration-150 ease-in-out shadow-md
        flex flex-col items-center sm:items-start text-center sm:text-left'
      >
        <span className='text-lg sm:text-xl font-semibold'>Payments</span>
        <div className='my-3 flex items-center justify-center sm:justify-start'>
          <ReceiptLong className='mr-2 text-xl sm:text-2xl' />
          <span className='text-3xl sm:text-4xl'>
            ₹ {new Intl.NumberFormat().format(total)}
          </span>
        </div>
        <span className='text-base sm:text-lg'>Total Payments Collected</span>
      </div>
    </div>
  );
}
