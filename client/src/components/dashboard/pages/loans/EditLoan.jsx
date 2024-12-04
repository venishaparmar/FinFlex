import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutButton from '../../../LogoutButton';
import { toast, ToastContainer } from 'react-toastify';

import Sidebar from '../../../sidebar/Sidebar';
import OneLoan from './OneLoan';

const EditLoan = ({ setAuth }) => {
  const location = useLocation();
  const loanId = location.pathname.split('/')[2];
  const [clientId, setClientId] = useState('');

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

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const GetLoan = async () => {
    try {
      const response = await fetch(`http://localhost:8000/loan/${loanId}`, {
        method: 'GET',
        headers: { Authorization: getCookie('token') },
      });
      const parseRes = await response.json();

      const formatDate = (d) => {
        const x = new Date(d);
        x.setHours(x.getHours() + 8);
        let month = x.getMonth() + 1;
        if (month < 10) month = '0' + month;
        let day = x.getDate();
        if (day < 10) day = '0' + day;
        return x.getFullYear() + '-' + month + '-' + day;
      };

      const start_date = formatDate(parseRes.date_released);
      const end_date = formatDate(parseRes.maturity_date);

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
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    GetLoan();
  }, []);

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const editSuccessful = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => resolve(), 1000);
      }),
      {
        pending: 'Updating Loan...',
        success: 'Updated Successfully!',
        error: 'Error!',
      },
      { autoClose: 1000 }
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { ...inputs };
      const response = await fetch(`http://localhost:8000/loans/${loanId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getCookie('token'),
        },
        body: JSON.stringify(body),
      });

      await response.json();
      editSuccessful();
      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } catch (error) {
      console.log(error.message);
    }
  };

  const navigate = useNavigate();
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

  return (
    <div className="flex h-full">
      <ToastContainer />

      <div className="w-full h-auto mx-auto px-8 py-8 mb-4 border bg-white shadow-md rounded">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-5 sm:px-6 bg-blue-500 rounded shadow-md">
          <div className="text-sm md:text-md text-white pl-2">
            <Sidebar />
          </div>
          <div className="flex-grow px-4 text-center">
            <h3 className="text-lg font-medium text-white">Update Loan Voucher # {loanId}</h3>
            <p className="text-sm text-white">Edit and update your loan</p>
          </div>
          <div className="text-white">
            {/* Logout Button */}
            <LogoutButton setAuth={setAuth} />
          </div>
        </div>

        {/* LOAN INFO */}
        <OneLoan />

        {/* EDIT FORM */}
        <div className="mt-5 px-4 py-2 rounded border shadow-md border-t-4 border-t-blue-500">
          <h3 className="text-lg font-medium leading-6 text-gray my-2 px-1 py-4 border-y-2">Edit Form</h3>
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2"
          >
            {/* LOAN TYPE */}
            <div>
              <label htmlFor="type">Loan Type: </label>
              <select
                className="block border border-gray-500t w-full p-3 rounded mb-4"
                name="type"
                id="type"
                value={type}
                onChange={onChange}
              >
                <option value="Personal Loan">Personal Loan</option>
                <option value="Salary Loan">Salary Loan</option>
                <option value="Business Loan">Business Loan</option>
              </select>
            </div>
            {/* LOAN STATUS */}
            <div>
              <label htmlFor="status">Status: </label>
              <select
                className="block border border-gray-500t w-full p-3 rounded mb-4"
                name="status"
                id="status"
                value={status}
                onChange={onChange}
              >
                <option value="Approved">Approved</option>
                <option value="Fully Paid">Fully Paid</option>
                <option value="Disbursed">Disbursed</option>
                <option value="Pending">Pending</option>
                <option value="Declined">Declined</option>
              </select>
            </div>
            {/* GROSS LOAN */}
            <div>
              <label htmlFor="gross_loan">Gross Loan: </label>
              <input
                type="number"
                className="block border border-gray-500t w-full p-3 rounded mb-4"
                name="gross_loan"
                value={gross_loan}
                onChange={onChange}
                placeholder="Gross Loan"
              />
            </div>
            {/* BALANCE */}
            <div>
              <label htmlFor="balance">Balance: </label>
              <input
                type="number"
                className="block border border-gray-500t w-full p-3 rounded mb-4"
                name="balance"
                value={balance}
                onChange={onChange}
                placeholder="Balance"
              />
            </div>
            {/* AMORTIZATION */}
            <div>
              <label htmlFor="amort">Amortization: </label>
              <input
                type="number"
                className="block border border-gray-500t w-full p-3 rounded mb-4"
                name="amort"
                value={amort}
                onChange={onChange}
                placeholder="Monthly Amortization"
              />
            </div>
            {/* TERMS */}
            <div>
              <label htmlFor="terms">Terms: </label>
              <select
                className="block border border-gray-500t w-full p-3 rounded mb-4"
                name="terms"
                id="terms"
                value={terms}
                onChange={onChange}
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
            <div>
              <label htmlFor="date_released">Date Released: </label>
              <input
                type="date"
                className="block border border-gray-500t w-full p-3 rounded mb-2"
                name="date_released"
                value={date_released}
                onChange={onChange}
                placeholder="Date Released"
              />
            </div>
            {/* MATURITY DATE */}
            <div>
              <label htmlFor="maturity_date">Maturity Date: </label>
              <input
                type="date"
                className="block border border-gray-500t w-full p-3 rounded mb-2"
                name="maturity_date"
                value={maturity_date}
                onChange={onChange}
                placeholder="Maturity Date"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-32 bg-blue-500 font-bold text-white py-3 rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditLoan;
