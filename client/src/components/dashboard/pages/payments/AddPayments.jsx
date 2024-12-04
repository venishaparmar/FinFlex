import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const AddPayments = ({ loanId, balance, clientId }) => {
  const [inputs, setInputs] = useState({
    amount: '',
    collection_date: '',
    collected_by: '',
    new_balance: '',
    method: '',
    client_id: clientId,
    loan_id: loanId,
  });

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const {
    amount,
    collection_date,
    collected_by,
    new_balance,
    method,
    client_id,
    loan_id,
  } = inputs;

  const addSuccessful = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
      {
        pending: 'Adding Payment...',
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
        amount,
        collection_date,
        collected_by,
        new_balance,
        method,
        client_id,
        loan_id,
      };

      const response = await fetch(`http://localhost:8000/payments/${loanId}`, {
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

  useEffect(() => {
    const updatedBalance = balance - inputs.amount;
    setInputs((prevState) => ({
      ...prevState,
      new_balance: updatedBalance,
    }));
  }, [inputs.amount, balance]);

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex mt-5 px-4 py-4 h-auto rounded border shadow-md border-t-4 border-t-blue-500">
      <ToastContainer />

      {/* Add Loan */}
      <div className="w-full">
        <div className="flex w-full items-center justify-between border-b-2 pb-4 mb-4">
          <h3 className="text-lg font-medium leading-6 text-gray-800">Loan Payment</h3>
        </div>

        {/* FORM */}
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4" onSubmit={onSubmit}>
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            {/* CLIENT ID */}
            <div className="flex-1">
              <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">
                Client ID:
              </label>
              <input
                type="number"
                className="block w-full border border-gray-300 p-3 rounded mt-1"
                name="client_id"
                value={clientId}
                disabled
              />
            </div>

            {/* VOUCHER */}
            <div className="flex-1 mt-4 sm:mt-0">
              <label htmlFor="loan_id" className="block text-sm font-medium text-gray-700">
                Voucher:
              </label>
              <input
                type="number"
                className="block w-full border border-gray-300 p-3 rounded mt-1"
                placeholder="Voucher #"
                name="loan_id"
                value={loanId}
                disabled
              />
            </div>
          </div>

          {/* COLLECTION DATE */}
          <div className="flex flex-col">
            <label htmlFor="collection_date" className="block text-sm font-medium text-gray-700">
              Collection Date:
            </label>
            <input
              type="date"
              className="block border border-gray-300 p-3 rounded mt-1"
              name="collection_date"
              value={collection_date}
              onChange={onChange}
            />
          </div>

          {/* AMOUNT */}
          <div className="flex flex-col">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount:
            </label>
            <input
              type="number"
              className="block border border-gray-300 p-3 rounded mt-1"
              placeholder="Amount"
              name="amount"
              value={amount}
              onChange={onChange}
            />
          </div>

          {/* COLLECTED BY */}
          <div className="flex flex-col">
            <label htmlFor="collected_by" className="block text-sm font-medium text-gray-700">
              Collected By:
            </label>
            <input
              type="text"
              className="block border border-gray-300 p-3 rounded mt-1"
              placeholder="Collected by"
              name="collected_by"
              value={collected_by}
              onChange={onChange}
            />
          </div>

          {/* NEW BALANCE */}
          <div className="flex flex-col">
            <label htmlFor="new_balance" className="block text-sm font-medium text-gray-700">
              New Balance:
            </label>
            <input
              type="number"
              className="block border border-gray-300 p-3 rounded mt-1"
              name="new_balance"
              value={inputs.new_balance}
              disabled
            />
          </div>

          {/* METHOD */}
          <div className="flex flex-col">
            <label htmlFor="method" className="block text-sm font-medium text-gray-700">
              Method:
            </label>
            <select
              className="block border border-gray-300 p-3 rounded mt-1"
              name="method"
              value={method}
              onChange={onChange}
            >
              <option value="ATM">ATM</option>
              <option value="OTC">OTC</option>
              <option value="ONLINE BANK">ONLINE BANK</option>
              <option value="GCASH">GCASH</option>
            </select>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <button
              type="submit"
              className="text-center font-bold py-3 rounded bg-blue-500 text-white hover:bg-blue-700 focus:outline-none my-1 sm:w-1/5 w-full"
            >
              Add Payment
            </button>
            <button
              onClick={goBack}
              className="text-center font-bold py-3 rounded bg-blue-500 text-white hover:bg-blue-700 focus:outline-none my-1 sm:w-1/5 w-full"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPayments;
