import React from 'react';
import { Link } from 'react-router-dom';
import { Logout } from '@mui/icons-material';

const LogoutButton = ({ setAuth }) => {
  const handleLogout = () => {
    // Clear the token cookie
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Update the authentication state
    setAuth(false);
  };

  return (
    <button
      className='text-white hover:scale-105'
      onClick={handleLogout}
    >
      <Link to='/login'>
        <Logout fontSize='large' className='text-sm md:text-lg text-white' />
      </Link>
    </button>
  );
};

export default LogoutButton;
