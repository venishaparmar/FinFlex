import { VisibilityOutlined } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ApprovalWidget() {
  const [loans, setLoans] = useState([]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const getLoans = async () => {
    try {
      const response = await fetch("http://localhost:8000/allLoans", {
        method: "GET",
        headers: { Authorization: getCookie("token") },
      });

      const parseRes = await response.json();
      setLoans(parseRes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLoans();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="mt-5 p-6 md:p-8 rounded-xl border border-t-4 border-t-blue-500 cursor-pointer shadow-md">
        <h3 className="text-xl md:text-2xl font-semibold mb-5 border-b-2 pb-2">Loans For Approval</h3>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-center">
            <thead>
              <tr>
                <th className="px-4 py-2 text-sm md:text-base">Gross Loan</th>
                <th className="px-4 py-2 text-sm md:text-base">Status</th>
                <th className="px-4 py-2 text-sm md:text-base">View</th>
              </tr>
            </thead>
            <tbody>
              {loans.length <= 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 bg-blue-50 text-sm md:text-base">
                    No Loan Data Available
                  </td>
                </tr>
              ) : (
                loans.map((loan, index) => {
                  if (loan.status === "Pending")
                    return (
                      <tr key={index}>
                        <td className="border px-4 py-2 bg-gray-50 text-sm md:text-base">
                        ₹ {loan.gross_loan}
                        </td>
                        <td className="border px-4 py-2 text-sm md:text-base">
                          <span className="bg-yellow-300 text-white px-4 py-1 rounded-md">
                            {loan.status}
                          </span>
                        </td>
                        <td className="border px-2 py-2 bg-gray-50">
                          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center">
                            <Link
                              to={`/editLoan/${loan.id}`}
                              className="flex justify-center items-center"
                            >
                              <VisibilityOutlined className="text-lg md:text-xl" />
                            </Link>
                          </button>
                        </td>
                      </tr>
                    );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
