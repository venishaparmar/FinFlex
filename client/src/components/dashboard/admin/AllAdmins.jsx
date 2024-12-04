import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { DeleteForever } from '@mui/icons-material';

const Admins = ({ setAuth }) => {
  const [admins, setAdmins] = useState([]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const getAdmins = async () => {
    try {
      const response = await fetch('http://localhost:8000/allAdmins', {
        method: 'GET',
        headers: { Authorization: getCookie('token') },
      });
      const parseRes = await response.json();
      setAdmins(parseRes);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNotif = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      }),
      {
        pending: 'Deleting Admin...',
        success: 'Deleted Successfully!',
        error: 'Error!',
      },
      {
        autoClose: 2000,
      }
    );
  };

  async function deleteAdmin(id) {
    try {
      await fetch(`http://localhost:8000/admins/${id}`, {
        method: 'DELETE',
        headers: { Authorization: getCookie('token') },
      });
      deleteNotif();
      setTimeout(() => {
        setAdmins(admins.filter((admin) => admin.id !== id));
      }, 2000);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getAdmins();
  }, []);

  return (
    <div className="w-full bg-white shadow-md rounded mt-5 border-t-4 border-t-blue-500">
      <ToastContainer />
      <div className="py-5 px-5">
        {/* TITLE */}
        <div className="flex items-center justify-between border-b-2 mb-4">
          <h3 className="text-lg font-medium text-gray-800">Manage Admins</h3>
          <button className="border hover:bg-blue-700 bg-blue-500 text-white font-bold py-2 px-4 rounded">
            <Link to="/addAdmin">Add Admin</Link>
          </button>
        </div>

        {/* INFO */}
        <div className="w-full overflow-auto border rounded shadow-md">
          <table className="min-w-[600px] text-center w-full">
            <thead>
              <tr>
                <th className="px-2 py-2 text-gray-600">ID</th>
                <th className="px-2 py-2 text-gray-600">Full Name</th>
                <th className="px-2 py-2 text-gray-600">Contact Number</th>
                <th className="px-2 py-2 text-gray-600">Address</th>
                <th className="px-2 py-2 text-gray-600">Email</th>
                <th className="px-2 py-2 text-gray-600">Delete</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center px-4 py-2 bg-blue-50">
                    No Admin Data
                  </td>
                </tr>
              ) : (
                admins.map((admin, index) => (
                  <tr key={index}>
                    <td className="border px-2 py-2">{admin.id}</td>
                    <td className="border px-2 py-2">{admin.firstName} {admin.lastName}</td>
                    <td className="border px-2 py-2">{admin.contactNumber}</td>
                    <td className="border px-2 py-2">{admin.address}</td>
                    <td className="border px-2 py-2 break-words max-w-[150px]">{admin.email}</td>
                    <td className="border px-2 py-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded focus:outline-none"
                        onClick={() => deleteAdmin(admin.id)}
                      >
                        <DeleteForever className="text-lg" />
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
};

export default Admins;
