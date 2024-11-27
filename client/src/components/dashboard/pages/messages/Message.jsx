import React, { useEffect, useState } from 'react';
import emailjs from 'emailjs-com';
import { toast, ToastContainer } from 'react-toastify';

export default function Message({ email }) {
  const [fullname, setFullname] = useState('');

  const getClient = async () => {
    try {
      const response = await fetch(`http://localhost:8000/email/${email}`, {
        method: 'GET',
        headers: { Authorization: localStorage.getItem('token') },
      });

      const parseRes = await response.json();
      setFullname(parseRes.firstname + ' ' + parseRes.lastname);
    } catch (error) {
      console.log(error);
    }
  };

  const addSuccessful = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
      {
        pending: 'Sending your mail...',
        success: 'Sent Successfully!',
        error: 'Error!',
      },
      {
        autoClose: 1000,
      }
    );
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_2kyejr4',
        'Loan_Approval',
        e.target,
        'mDqAo3YVF6cq60oy7'
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
    addSuccessful();
  };

  useEffect(() => {
    getClient();
  }, [email]);

  return (
    <div className="flex flex-col items-center">
      <ToastContainer />
      <div className="w-full max-w-3xl px-4 mt-5 border rounded shadow-md border-t-4 border-t-blue-500">
        <div className="px-4 py-6 bg-white">
          <form onSubmit={sendEmail} className="space-y-6">
            {/* Name and Email */}
            <div className="flex flex-col md:flex-row md:gap-5">
              {/* Fullname */}
              <div className="w-full mb-4 md:mb-0">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="fullname"
                >
                  Full Name:
                </label>
                <input
                  type="text"
                  className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  name="fullname"
                  value={fullname}
                  placeholder="Choose a borrower"
                  readOnly
                />
              </div>

              {/* Email */}
              <div className="w-full">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email:
                </label>
                <input
                  type="email"
                  className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  name="email"
                  value={email}
                  readOnly
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Subject
              </label>
              <select
                className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                name="subject"
                id="subject"
              >
                <option value="Loan Approval">Loan Approval</option>
                <option value="Loan Denied">Loan Denied</option>
                <option value="Loan Disbursed">Loan Disbursed</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Your message
              </label>
              <textarea
                name="message"
                id="message"
                rows="6"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="Write your message..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline w-full md:w-auto"
              >
                Send message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
