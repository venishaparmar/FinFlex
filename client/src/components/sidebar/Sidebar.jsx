// import React from 'react';
// import { Link } from 'react-router-dom';

// import {
//   PermIdentity,
//   CreditScore,
//   ReceiptLong,
//   MailOutline,
//   Home,
// } from '@mui/icons-material';

// export default function Sidebar() {
//   return (
//     <div className='md:block px-5 py-5 md:w-60 lg:w-60 transition-transform duration-300 ease-in-out border shadow-lg rounded-md'>
//       {/* LOGO */}
//       <div className='my-10'>
//         <h3 className='text-center text-2xl'>FinFlex</h3>
//         <p className='text-center text-sm'>Lending Application</p>
//       </div>

//       <hr className='h-px bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent' />
//       {/* MENU */}
//       <div className='my-10'>
//         <ul>
//           <li className='text-sm font-medium text-gray-700 py-2 px-2 hover:bg-blue-500 hover:text-white hover:text-base rounded-md transition duration-150 ease-in-out cursor-pointer'>
//             <Home />
//             <Link to='/home' className='ml-2.5'>
//               Home
//             </Link>
//           </li>

//           <li className='text-sm font-medium text-gray-700 py-2 px-2 hover:bg-blue-500 hover:text-white hover:text-base rounded-md transition duration-150 ease-in-out'>
//             <PermIdentity />
//             <Link to='/borrowers' className='ml-2.5'>
//               Borrowers
//             </Link>
//           </li>

//           <li className='text-sm font-medium text-gray-700 py-2 px-2 hover:bg-blue-500 hover:text-white hover:text-base rounded-md transition duration-150 ease-in-out'>
//             <CreditScore />
//             <Link to='/loans' className='ml-2.5'>
//               Loans
//             </Link>
//           </li>

//           <li className='text-sm font-medium text-gray-700 py-2 px-2 hover:bg-blue-500 hover:text-white hover:text-base rounded-md transition duration-150 ease-in-out'>
//             <ReceiptLong />
//             <Link to='/payments' className='ml-2.5'>
//               Payments
//             </Link>
//           </li>

//           <li className='text-sm font-medium text-gray-700 py-2 px-2 hover:bg-blue-500 hover:text-white hover:text-base rounded-md transition duration-150 ease-in-out'>
//             <MailOutline />
//             <Link to='/emailClient' className='ml-2.5'>
//               Email
//             </Link>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }
import React from 'react';
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

// Styled components for persistent drawer behavior
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Sidebar = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Drawer for the Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
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
          <hr className="h-px bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />

          {/* MENU */}
          <div className="my-10">
            <ul>
              <li className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-blue-500 hover:text-white hover:text-base rounded-md transition duration-150 ease-in-out cursor-pointer">
                <Home />
                <Link to="/home" className="ml-2.5">Home</Link>
              </li>
              <li className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-blue-500 hover:text-white hover:text-base rounded-md transition duration-150 ease-in-out cursor-pointer">
                <PermIdentity />
                <Link to="/borrowers" className="ml-2.5">Borrowers</Link>
              </li>
              <li className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-blue-500 hover:text-white hover:text-base rounded-md transition duration-150 ease-in-out cursor-pointer">
                <CreditScore />
                <Link to="/loans" className="ml-2.5">Loans</Link>
              </li>
              <li className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-blue-500 hover:text-white hover:text-base rounded-md transition duration-150 ease-in-out cursor-pointer">
                <ReceiptLong />
                <Link to="/payments" className="ml-2.5">Payments</Link>
              </li>
              <li className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-blue-500 hover:text-white hover:text-base rounded-md transition duration-150 ease-in-out cursor-pointer">
                <MailOutline />
                <Link to="/emailClient" className="ml-2.5">Email</Link>
              </li>
            </ul>
          </div>
        </div>
      </Drawer>

      {/* Menu Icon Button to open the Sidebar */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        sx={{ position: 'absolute', top: 16, left: 16 }}
      >
        <MenuIcon />
      </IconButton>
    </Box>
  );
};

export default Sidebar;
