import { MailOutline } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DatesWidget() {
  const [dates, setDates] = useState([]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const getDates = async () => {
    try {
      const response = await fetch('http://localhost:8000/allLoans', {
        method: 'GET',
        headers: { Authorization: getCookie('token') },
      });

      const parseRes = await response.json();
      setDates(parseRes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDates();
  }, []);

  return (
    <div className="w-full h-full">
      {/* CLIENTS */}
      <div className="mt-5 p-6 md:p-8 rounded-xl border border-t-4 border-t-blue-500 cursor-pointer shadow-md">
        <h3 className="text-lg md:text-xl font-semibold mb-5 border-b-2 pb-2">Maturity Date</h3>
        <div className="overflow-x-auto">
          <table className="table-auto text-center w-full">
            <thead>
              <tr>
                <th className="px-2 py-2 text-sm sm:text-base">Customer</th>
                <th className="px-2 py-2 text-sm sm:text-base">Date</th>
                <th className="px-2 py-2 text-sm sm:text-base">Balance</th>
                <th className="px-2 py-2 text-sm sm:text-base">Email</th>
              </tr>
            </thead>
            <tbody>
              {dates.length <= 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-sm sm:text-base bg-blue-50">
                    No Loan Data Available
                  </td>
                </tr>
              ) : (
                dates.map((date, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2 bg-gray-50 text-sm sm:text-base">
                      {date.firstname} {date.lastname}
                    </td>
                    <td className="border px-4 py-2 text-sm sm:text-base">
                      {new Date(date.maturity_date).toDateString()}
                    </td>
                    <td className="border px-4 py-2 bg-gray-50 text-sm sm:text-base">
                      ₹ {date.balance}
                    </td>
                    <td className="border px-2 py-2">
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center">
                        <Link to={`/emailClient`} className="flex justify-center items-center">
                          <MailOutline className="text-lg sm:text-xl" />
                        </Link>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
