import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';

import {
  PermIdentity,
  CreditScore,
  ReceiptLong,
  MailOutline,
  Home,
} from '@mui/icons-material';

const drawerWidth = 240;

// Styled Drawer Header
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Sidebar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false); // Default is closed for mobile view

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box className="flex">
      {/* Sidebar Toggle Button */}
      <IconButton
        color="inherit"
        aria-label="toggle drawer"
        onClick={toggleDrawer}
        className="" // Displayed only on small screens
      >
        <MenuIcon />
      </IconButton>

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="temporary" // Mobile-friendly drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer} // Close on backdrop click
      >
        <DrawerHeader>
          <IconButton onClick={toggleDrawer}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />

        {/* Sidebar Content */}
        <div className="px-5 py-5">
          {/* LOGO */}
          <div className="my-10 text-center">
            <h3 className="text-2xl font-semibold">FinFlex</h3>
            <p className="text-sm text-gray-600">Lending Application</p>
          </div>
          <Divider />

          {/* MENU */}
          <div className="my-10">
            <ul className="space-y-4">
              {[
                { to: '/home', label: 'Home', Icon: Home },
                { to: '/borrowers', label: 'Borrowers', Icon: PermIdentity },
                { to: '/loans', label: 'Loans', Icon: CreditScore },
                { to: '/payments', label: 'Payments', Icon: ReceiptLong },
                { to: '/emailClient', label: 'Email', Icon: MailOutline },
              ].map(({ to, label, Icon }) => (
                <li
                  key={to}
                  className="flex items-center text-gray-700 hover:bg-blue-500 hover:text-white rounded-md transition duration-150 ease-in-out py-2 px-4 cursor-pointer"
                >
                  <Icon className="mr-3" />
                  <Link to={to} className="w-full">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
