import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoutButton from '../../../LogoutButton';
import { ToastContainer, toast } from 'react-toastify';

import Sidebar from '../../../sidebar/Sidebar';

const AddLoan = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
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
    type,
    gross_loan,
    balance,
    amort,
    terms,
    date_released,
    maturity_date,
  } = inputs;

  const navigate = useNavigate();
  const location = useLocation();

  const clientId = location.pathname.split('/')[2];

  const addSuccessful = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
      {
        pending: 'Adding Loan...',
        success: 'Added Successfully!',
        error: 'Error!',
      },
      {
        autoClose: 1000,
      }
    );
  };
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        type,
        gross_loan,
        balance,
        amort,
        terms,
        date_released,
        maturity_date,
      };

      const response = await fetch(`http://localhost:8000/loans/${clientId}`, {
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
        navigate(-1);
      }, 3000);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex h-full">

      <ToastContainer />

      {/* Add Loan */}
      <div className="w-full mx-auto px-8 py-8 mb-4 border bg-white shadow-md rounded">
        {/* TITLE */}
        <div className="flex items-center justify-between px-4 py-5 sm:px-6 bg-blue-500 rounded shadow-md">
          <div className="text-sm md:text-md text-white pl-2">
            <Sidebar />
          </div>
          <div className="flex-grow px-4 text-center">
            <h3 className="text-lg font-medium text-white">Add Loan for Client #{clientId}</h3>
            <p className="text-sm text-white">Fill all the required fields.</p>
          </div>

          {/* BUTTON */}
          <div className="text-white">
            {/* Logout Button */}
            <LogoutButton setAuth={setAuth} />
          </div>
        </div>

        {/* FORM */}
        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 mt-5 p-8 h-auto rounded border shadow-md border-t-4 border-t-blue-500"
          onSubmit={onSubmit}
        >
          {/* TYPE */}
          <div className="mb-4">
            <label htmlFor="type">Type of Loan:</label>
            <select
              className="block border border-grey-500 w-full p-3 rounded"
              name="type"
              id="type"
              value={type}
              onChange={(e) => onChange(e)}
            >
              <option value="Personal Loan">Personal Loan</option>
              <option value="Salary Loan">Salary Loan</option>
              <option value="Business Loan">Business Loan</option>
            </select>
          </div>

          {/* STATUS */}
          <div className="mb-4">
            <label htmlFor="maturity_date">Status:</label>
            <input
              className="block border border-grey-500 w-full p-3 rounded"
              name="status"
              id="status"
              value="Pending"
              disabled
            />
          </div>

          {/* GROSS LOAN */}
          <div className="mb-4">
            <label htmlFor="gross_loan">Gross Loan:</label>
            <input
              type="number"
              className="block border border-grey-500 w-full p-3 rounded"
              placeholder="Gross Loan"
              name="gross_loan"
              value={gross_loan}
              onChange={(e) => onChange(e)}
            />
          </div>

          {/* BALANCE */}
          <div className="mb-4">
            <label htmlFor="balance">Balance:</label>
            <input
              type="number"
              className="block border border-grey-500 w-full p-3 rounded"
              placeholder="Balance"
              name="balance"
              value={balance}
              onChange={(e) => onChange(e)}
            />
          </div>

          {/* AMORTIZATION */}
          <div className="mb-4">
            <label htmlFor="amort">Amortization:</label>
            <input
              type="number"
              className="block border border-grey-500 w-full p-3 rounded"
              placeholder="Amortization"
              name="amort"
              value={amort}
              onChange={(e) => onChange(e)}
            />
          </div>

          {/* TERMS */}
          <div className="mb-4">
            <label htmlFor="terms">Terms:</label>
            <select
              className="block border border-grey-500 w-full p-3 rounded"
              name="terms"
              id="terms"
              value={terms}
              onChange={(e) => onChange(e)}
            >
              <option value="1">1 Month</option>
              <option value="2">2 Months</option>
              <option value="3">3 Months</option>
              <option value="4">4 Months</option>
              <option value="5">5 Months</option>
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
            </select>
          </div>

          {/* DATE RELEASED */}
          <div className="mb-4">
            <label htmlFor="date_released">Date Released:</label>
            <input
              type="datetime-local"
              className="block border border-grey-500 w-full p-3 rounded"
              placeholder="Date Released"
              name="date_released"
              value={date_released}
              onChange={(e) => onChange(e)}
            />
          </div>

          {/* MATURITY DATE */}
          <div className="mb-4">
            <label htmlFor="maturity_date">Maturity Date:</label>
            <input
              type="date"
              className="block border border-grey-500 w-full p-3 rounded"
              placeholder="Maturity Date"
              name="maturity_date"
              value={maturity_date}
              onChange={(e) => onChange(e)}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
            <button
              className="text-center font-bold py-3 rounded bg-blue-500 text-white hover:bg-blue-700 focus:outline-none w-full sm:w-1/5"
              type="submit"
            >
              Add New Loan
            </button>
            <button
              className="text-center font-bold py-3 rounded bg-blue-500 text-white hover:bg-blue-700 focus:outline-none w-full sm:w-1/5"
            >
              <Link to={`/borrower/${clientId}`} className="block w-full text-center">
                Cancel
              </Link>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddLoan;
