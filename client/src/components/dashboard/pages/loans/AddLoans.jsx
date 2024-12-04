import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logout } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';

import Sidebar from '../../../sidebar/Sidebar';

const AddLoans = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    client_id: '',
    status: '',
    type: '',
    gross_loan: '',
    balance: '',
    amort: '',
    terms: '',
    date_released: '',
    maturity_date: '',
  });

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const {
    client_id,
    status,
    type,
    gross_loan,
    balance,
    amort,
    terms,
    date_released,
    maturity_date,
  } = inputs;

  const navigate = useNavigate();
  const addSuccessful = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
      {
        pending: 'Adding Loan...',
        success: 'Added Succesfully!',
        error: 'Error!',
      },
      {
        autoClose: 1000,
      }
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure all fields are filled
    if (
      !client_id ||
      !type ||
      !status ||
      !gross_loan ||
      !balance ||
      !amort ||
      !terms ||
      !date_released ||
      !maturity_date
    ) {
      toast.error('Please fill all fields.', { autoClose: 2000 });
      return;
    }
  
    // Check if maturity date is after the release date
    if (new Date(maturity_date) <= new Date(date_released)) {
      toast.error('Maturity date must be after the release date.', { autoClose: 2000 });
      return;
    }
  
    try {
      // Existing form submission logic
      const timenow = new Date();
      const formatTime = (t) => {
        const x = new Date(t);
        let hour = x.getHours().toString().padStart(2, '0');
        let min = x.getMinutes().toString().padStart(2, '0');
        let sec = x.getSeconds().toString().padStart(2, '0');
        return `${hour}:${min}:${sec}`;
      };
  
      const timestamp = `${date_released} ${formatTime(timenow)}`;
  
      const body = {
        client_id,
        type,
        status,
        gross_loan,
        balance,
        amort,
        terms,
        date_released,
        maturity_date,
      };
      
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };

      const response = await fetch(`http://localhost:8000/loans`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: getCookie('token'),
        },
        body: JSON.stringify(body),
      });
  
      const parseRes = await response.json();
      addSuccessful();
  
      setTimeout(() => {
        navigate(`/Borrower/${client_id}`);
      }, 3000);
    } catch (error) {
      console.log(error.message);
      toast.error('An error occurred while adding the loan.');
    }
  };
  



  return (
    <div className='h-[900px] flex'>
      <ToastContainer />
      <div className='w-full h-full mx-auto px-8 py-8 mb-4 border bg-white shadow-md rounded '>
        {/* HEADER */}
        <div className='flex items-center justify-between px-4 py-5 sm:px-6 bg-blue-500 rounded shadow-md  '>
          <div className='text-sm md:text-md text-white pl-2'>
            <Sidebar />
          </div>
          <div className='flex-grow px-4 text-center'>
            <h3 className='text-lg font-medium text-white'>Add New Loan</h3>
            <p className='text-sm text-white'>Add a loan for a client</p>
          </div>
          {/* <ToastContainer /> */}

          {/* BUTTON */}

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

        {/* FORM */}
        <form
          className='mt-5 p-6 sm:p-8 rounded border shadow-md grid grid-cols-1 sm:grid-cols-2 gap-4 border-t-4 border-t-blue-500'
          onSubmit={onSubmit}
        >
          {/* CLIENT ID */}
          <div>
            <label htmlFor='client_id' className='block text-sm sm:text-base font-medium mb-2'>
              Client ID:
            </label>
            <input
              type='number'
              className='block w-full border border-gray-300 p-2 sm:p-3 rounded mb-4 text-sm sm:text-base'
              placeholder='Client ID'
              name='client_id'
              value={client_id}
              onChange={(e) => onChange(e)}
            />
          </div>

          {/* TYPE */}
          <div>
            <label htmlFor='type' className='block text-sm sm:text-base font-medium mb-2'>
              Type of Loan:
            </label>
            <select
              className='block w-full border border-gray-300 p-2 sm:p-3 rounded mb-4 text-sm sm:text-base'
              name='type'
              id='type'
              value={type}
              onChange={(e) => onChange(e)}
            >
              <option value='Personal Loan'>Personal Loan</option>
              <option value='Salary Loan'>Salary Loan</option>
              <option value='Business Loan'>Business Loan</option>
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label htmlFor='status' className='block text-sm sm:text-base font-medium mb-2'>
              Status:
            </label>
            <select
              className='block w-full border border-gray-300 p-2 sm:p-3 rounded mb-4 text-sm sm:text-base'
              name='status'
              id='status'
              value={status}
              onChange={(e) => onChange(e)}
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
            <label htmlFor='gross_loan' className='block text-sm sm:text-base font-medium mb-2'>
              Gross Loan:
            </label>
            <input
              type='number'
              className='block w-full border border-gray-300 p-2 sm:p-3 rounded mb-4 text-sm sm:text-base'
              placeholder='Gross Loan'
              name='gross_loan'
              value={gross_loan}
              onChange={(e) => onChange(e)}
            />
          </div>

          {/* BALANCE */}
          <div>
            <label htmlFor='balance' className='block text-sm sm:text-base font-medium mb-2'>
              Balance:
            </label>
            <input
              type='number'
              className='block w-full border border-gray-300 p-2 sm:p-3 rounded mb-4 text-sm sm:text-base'
              placeholder='Balance'
              name='balance'
              value={balance}
              onChange={(e) => onChange(e)}
            />
          </div>

          {/* AMORTIZATION */}
          <div>
            <label htmlFor='amort' className='block text-sm sm:text-base font-medium mb-2'>
              Amortization:
            </label>
            <input
              type='number'
              className='block w-full border border-gray-300 p-2 sm:p-3 rounded mb-4 text-sm sm:text-base'
              placeholder='Amortization'
              name='amort'
              value={amort}
              onChange={(e) => onChange(e)}
            />
          </div>

          {/* TERMS */}
          <div>
            <label htmlFor='terms' className='block text-sm sm:text-base font-medium mb-2'>
              Terms:
            </label>
            <select
              className='block w-full border border-gray-300 p-2 sm:p-3 rounded mb-4 text-sm sm:text-base'
              name='terms'
              id='terms'
              value={terms}
              onChange={(e) => onChange(e)}
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
            <label htmlFor='date_released' className='block text-sm sm:text-base font-medium mb-2'>
              Date Released:
            </label>
            <input
              type='datetime-local'
              className='block w-full border border-gray-300 p-2 sm:p-3 rounded mb-4 text-sm sm:text-base'
              name='date_released'
              value={date_released}
              onChange={(e) => onChange(e)}
            />
          </div>

          {/* MATURITY DATE */}
          <div>
            <label htmlFor='maturity_date' className='block text-sm sm:text-base font-medium mb-2'>
              Maturity Date:
            </label>
            <input
              type='date'
              className='block w-full border border-gray-300 p-2 sm:p-3 rounded mb-4 text-sm sm:text-base'
              name='maturity_date'
              value={maturity_date}
              onChange={(e) => onChange(e)}
            />
          </div>

          {/* BUTTONS */}
          <div className='sm:col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-6'>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto'
              type='submit'
            >
              Add New Loan
            </button>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto'>
              <Link to={`/loans`}>Cancel</Link>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddLoans;
