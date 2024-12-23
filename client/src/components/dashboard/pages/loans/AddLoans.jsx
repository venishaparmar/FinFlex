import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from '../../../LogoutButton';
import { ToastContainer, toast } from 'react-toastify';

import Sidebar from '../../../sidebar/Sidebar';
import { use } from 'react';

const AddLoans = ({ setAuth }) => {

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  useEffect(() => {
    getClientsName();
  }, []);

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

  //fetch names for client_id
  const [clients, setClients] = useState([]);
  const getClientsName = async () => {
    try {
      const response = await fetch('http://localhost:8000/clientName', {
        method: 'GET',
        headers: { Authorization: getCookie('token') },
      });

      const parseRes = await response.json();
      setClients(parseRes);


    } catch (error) {
      console.error(error.message);
    }
  }

  const validateForm = () => {
    let errorMessages = [];
  
    // Check for missing fields
    if (!client_id?.trim()) errorMessages.push("Client ID is required.");
    if (!type?.trim()) errorMessages.push("Type of Loan is required.");
    if (!status?.trim()) errorMessages.push("Status is required.");
    if (!gross_loan) errorMessages.push("Gross Loan is required.");
    if (!balance) errorMessages.push("Balance is required.");
    if (!amort) errorMessages.push("Amortization is required.");
    if (!terms) errorMessages.push("Terms are required.");
    if (!date_released) errorMessages.push("Date Released is required.");
    if (!maturity_date) errorMessages.push("Maturity Date is required.");
  
    // Check for negative values
    if (gross_loan < 0) errorMessages.push("Gross Loan cannot be negative.");
    if (balance < 0) errorMessages.push("Balance cannot be negative.");
    if (amort < 0) errorMessages.push("Amortization cannot be negative.");
    if (terms < 0) errorMessages.push("Terms cannot be negative.");
  
    // Check balance is less than or equal to gross loan
    if (balance > gross_loan) {
      errorMessages.push("Balance cannot be greater than Gross Loan.");
    }
  
    // Check if maturity date is after the release date
    if (new Date(maturity_date) <= new Date(date_released)) {
      errorMessages.push("Maturity date must be after the release date.");
    } else {
      // Calculate expected maturity date based on terms
      const releaseDate = new Date(date_released);
      const expectedMaturityDate = new Date(releaseDate);
      expectedMaturityDate.setMonth(releaseDate.getMonth() + parseInt(terms)); // Add terms (in months)
  
      // Check if the actual maturity date is at least as far as the expected maturity date
      if (new Date(maturity_date) < expectedMaturityDate) {
        errorMessages.push(
          `Maturity date must be at least ${terms} months after the release date.`
        );
      }
    }
  
    // Display error messages
    if (errorMessages.length > 0) {
      toast.error(errorMessages.join(" "), { autoClose: 3000 });
      return false; // Validation failed
    }
  
    return true; // Validation passed
  };


  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Validation failed
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
            {/* Logout Button */}
            <LogoutButton setAuth={setAuth} />
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
              Client:
            </label>
            <select
              className='block w-full border border-gray-300 p-2 sm:p-3 rounded mb-4 text-sm sm:text-base'
              name='client_id'
              value={client_id}
              onChange={(e) => onChange(e)}
            >
              <option value='' disabled>
                Select Client
              </option>
              {clients.length === 0 ? (<option value='' disabled>
                Please add a client first
              </option>) : (
                clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {`${client.firstname} ${client.lastname}`}
                  </option>
                ))
              )}
              {/* Add more options as needed */}
            </select>
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
              <option value='' disabled>
                Select Type of Loan
              </option>
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
              <option value='' disabled>
                Select Status
              </option>
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
              <option value='' disabled>
                Select Terms
              </option>
              <option value='1'>1 Month</option>
              <option value='2'>2 Months</option>
              <option value='3'>3 Months</option>
              <option value='4'>4 Months</option>
              <option value='5'>5 Months</option>
              <option value='6'>6 Months</option>
              <option value='12'>12 Months</option>
              <option value='18'>18 Month</option>
              <option value='24'>24 Months</option>
              <option value='30'>30 Months</option>
              <option value='36'>36 Months</option>
              <option value='42'>42 Months</option>
              <option value='48'>48 Months</option>
              <option value='54'>54 Months</option>
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
