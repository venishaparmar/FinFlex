import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logout } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';

import Sidebar from '../../../sidebar/Sidebar';
import OneLoan from './OneLoan';

const EditLoan = ({ setAuth }) => {
  const location = useLocation();

  const loanId = location.pathname.split('/')[2];

  const [clientId, setClientId] = useState('');
  const GetLoan = async () => {
    try {
      const response = await fetch(`http://localhost:8000/loan/${loanId}`, {
        method: 'GET',
        headers: { Authorization: localStorage.getItem('token') },
      });

      const parseRes = await response.json();

      const formatDate = (d) => {
        const x = new Date(d);
        x.setHours(x.getHours() + 8);
        let month = x.getMonth() + 1;
        if (month < 10) {
          month = '0' + month;
        }
        let day = x.getDate();
        if (day < 10) {
          day = '0' + day;
        }
        return x.getFullYear() + '-' + month + '-' + day;
      };

      console.log(parseRes.date_released);
      const start_date = formatDate(parseRes.date_released);
      console.log(start_date);

      const end_date = formatDate(parseRes.maturity_date);
      console.log(end_date);

      setInputs({
        type: parseRes.type,
        balance: parseRes.balance,
        gross_loan: parseRes.gross_loan,
        amort: parseRes.amort,
        terms: parseRes.terms,
        status: parseRes.status,
        date_released: start_date,
        maturity_date: end_date,
      });

      setClientId(parseRes.client_id);
      console.log(clientId);
      console.log('Date Released:', parseRes.date_released);
    } catch (error) {
      console.log(error.message);
    }
  };
  const [inputs, setInputs] = useState({
    type: '',
    balance: '',
    gross_loan: '',
    amort: '',
    terms: '',
    status: '',
    date_released: '',
    maturity_date: '',
  });

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // const timenow = new Date();
  // const formatTime = (t) => {
  //   const x = new Date(t);
  //   let hour = x.getHours();

  //   if (hour < 10) {
  //     hour = '0' + hour;
  //   }
  //   let min = x.getMinutes();
  //   if (min < 10) {
  //     min = '0' + min;
  //   }

  //   let sec = x.getSeconds();
  //   if (sec < 10) {
  //     sec = '0' + sec;
  //   }

  //   return hour + ':' + min + ':' + sec;
  // };

  // console.log(formatTime(timenow));

  // const timestamp = date_released + formatTime(timenow);
  const {
    type,
    balance,
    gross_loan,
    amort,
    terms,
    status,
    date_released,
    maturity_date,
  } = inputs;

  const editSuccessful = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
      {
        pending: 'Updating Loan...',
        success: 'Updated Succesfully!',
        error: 'Error!',
      },
      {
        autoClose: 1000,
      }
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        type,
        balance,
        gross_loan,
        amort,
        terms,
        date_released,
        status,
        maturity_date,
      };

      const response = await fetch(`http://localhost:8000/loans/${loanId}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      editSuccessful();

      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } catch (error) {
      console.log(error.message);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    GetLoan();
  }, []);

  return (
    <div className='flex h-[900px]'>
      <Sidebar />
      <ToastContainer />

      <div className='w-full  h-[900px] mx-auto px-8 py-8 mb-4 border bg-white shadow-md rounded'>
        {/* HEADER */}
        <div className='flex items-center justify-between px-4 py-5 sm:px-6 bg-red-500 rounded shadow-md '>
          {/* TITLE */}
          <div>
            <h3 className='text-lg font-medium leading-6 text-white'>
              Update Loan Voucher # {loanId}
            </h3>
            <p className='mt-1 max-w-2xl text-sm text-white'>
              Edit and update your loan
            </p>
          </div>

          <div className='text-white'>
            <button
              className=''
              onClick={(e) => {
                setAuth(false);
              }}
            >
              <Link to='/login'>
                <Logout />
              </Link>
            </button>
          </div>
        </div>

        {/* LOAN INFO */}
        <OneLoan />

        {/* EDIT FORM */}
        <div className='mt-5 px-4 py-2 h-[530px] rounded border shadow-md border-t-4 border-t-red-500 '>
          <h3 className='text-lg font-medium leading-6 text-gray my-2 px-1 py-4 border-y-2 '>
            Edit Form
          </h3>
          <form
            onSubmit={(e) => {
              onSubmit(e);
            }}
            className='grid grid-cols-2 p-2 '
          >
            {/* LOAN TYPE */}
            <div>
              <label htmlFor='type'>Loan Type: </label>
              <select
                className='block border border-grey-500 w-10/12 p-3 rounded mb-4'
                name='type'
                id='type'
                value={type}
                onChange={(e) => {
                  onChange(e);
                }}
              >
                <option value='Personal Loan'>Personal Loan</option>
                <option value='Salary Loan'>Salary Loan</option>
                <option value='Business Loan'>Business Loan</option>
              </select>
            </div>
            {/* LOAN STATUS */}
            <div>
              <label htmlFor='status'>Status: </label>
              <select
                className='block border border-grey-500 w-10/12 p-3 rounded mb-4'
                name='status'
                id='status'
                value={status}
                onChange={(e) => {
                  onChange(e);
                }}
              >
                <option value='Approved'>Approved</option>
                <option value='Fully Paid'>Fully Paid</option>
                <option value='Disbursed'>Disbursed</option>
                <option value='Pending'>Pending</option>
                <option value='Declined'>Declined</option>
              </select>
            </div>
            {/* GROSS LOAN */}
            <div>
              <label htmlFor='gross_loan'>Gross Loan: </label>
              <input
                type='number'
                className='block border border-grey-500 w-10/12 p-3 rounded mb-4'
                name='gross_loan'
                value={gross_loan}
                onChange={(e) => {
                  onChange(e);
                }}
                placeholder='Gross Loan'
              />
            </div>
            {/* BALANCE */}
            <div>
              <label htmlFor='balance'>Balance: </label>
              <input
                type='number'
                className='block border border-grey-500 w-10/12 p-3 rounded mb-4'
                name='balance'
                value={balance}
                onChange={(e) => {
                  onChange(e);
                }}
                placeholder='Balance'
              />
            </div>
            {/* AMORTIZATION */}
            <div>
              <label htmlFor='amort'>Amortization: </label>
              <input
                type='number'
                className='block border border-grey-500t w-10/12 p-3 rounded mb-4'
                name='amort'
                value={amort}
                onChange={(e) => {
                  onChange(e);
                }}
                placeholder='Monthly Amortization'
              />
            </div>
            {/* TERMS */}
            <div>
              <label htmlFor='terms'>Terms: </label>
              <select
                className='block border border-grey-500 w-10/12 p-3 rounded mb-4'
                name='terms'
                id='terms'
                value={terms}
                onChange={(e) => {
                  onChange(e);
                }}
              >
                <option value='1'>1 Month</option>
                <option value='2'>2 Months</option>
                <option value='3'>3 Months</option>
                <option value='4'>4 Months</option>
                <option value='5'>5 Months</option>
                <option value='6'>6 Months</option>
                <option value='12'>12 Months</option>
              </select>
            </div>
            {/* DATE RELEASED */}
            <div>
              <label htmlFor='date_released'>Date Released: </label>
              <input
                type='date'
                className='block border border-grey-500t w-10/12 p-3 rounded mb-4'
                name='date_released'
                value={date_released}
                onChange={(e) => {
                  onChange(e);
                }}
                placeholder='Date Released'
              />
            </div>
            {/* MATURITY DATE */}
            <div>
              <label htmlFor='maturity_date'>Maturity Date: </label>
              <input
                type='date'
                className='block border border-grey-500t w-10/12 p-3 rounded mb-4'
                name='maturity_date'
                value={maturity_date}
                onChange={(e) => {
                  onChange(e);
                }}
                placeholder='Maturity Date'
              />
            </div>
            {/* BUTTONS */}
            <div>
              <button
                type='submit'
                className=' text-center py-3 rounded bg-red-500 text-white hover:bg-red-700 focus:outline-none my-1 w-1/5'
              >
                Update
              </button>
              <Link
                className=' ml-5 text-center py-3 rounded bg-red-500 text-white hover:bg-red-700 focus:outline-none my-1 w-1/5 inline-block'
                to={`/borrower/${clientId}`}
              >
                Back
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditLoan;
