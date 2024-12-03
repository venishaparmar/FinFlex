import './App.css';
import React, { Fragment, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  // useLocation,
} from 'react-router-dom';

// Import all components
import Home from './components/dashboard/pages/home/Home';
import Login from './components/auths/Login';
import Landing from './components/landing/Landing';
import Register from './components/auths/Register';
import GetAllLoans from './components/dashboard/pages/loans/ClientLoans';
import AddLoan from './components/dashboard/pages/loans/AddLoan';
import AddBorrower from './components/dashboard/pages/borrowers/AddBorrower';
import Borrower from './components/dashboard/pages/borrowers/Borrower';
import Borrowers from './components/dashboard/pages/borrowers/Borrowers';
import EditLoan from './components/dashboard/pages/loans/EditLoan';
import EditBorrower from './components/dashboard/pages/borrowers/EditBorrower';
import AddLoans from './components/dashboard/pages/loans/AddLoans';
import Payments from './components/dashboard/pages/payments/AllPayments';
import PaymentLoansInfo from './components/dashboard/pages/payments/PaymentLoanInfo';
import AdminPage from './components/dashboard/admin/AdminPage';
import AddAdmin from './components/dashboard/admin/AddAdmin';
import EmailPage from './components/dashboard/pages/messages/EmailPage';

function App() {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Function to get the value of a specific cookie by name
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };
  
    // Check cookie for auth status on app load
    useEffect(() => {
      const authStatus = getCookie('isAuthenticated');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      }
    }, []);
  
    // Update auth state and set cookie
    const setAuth = (boolean) => {
      setIsAuthenticated(boolean);
      if (boolean) {
        // Set the cookie to expire in 1 day (86400 seconds)
        document.cookie = `isAuthenticated=true; path=/; max-age=86400;`;
      } else {
        // Delete the cookie by setting its expiration date to the past
        document.cookie = `isAuthenticated=; path=/; max-age=0;`;
      }
    };
  

  return (
    <Router>
      <div className='App py-10 px-10'>
        <Fragment>
          <Routes>
            {/* LANDING */}
            <Route exact path='/' element={<Landing />} />

            {/* LOGIN */}
            <Route
              exact
              path='/login'
              element={
                !isAuthenticated ? (
                  <Login setAuth={setAuth} />
                ) : (
                  <Navigate to='/home' />
                )
              }
            />

            {/* REGISTER */}
            <Route
              exact
              path='/register'
              element={
                isAuthenticated ? (
                  <Register setAuth={setAuth} />
                ) : (
                  <Navigate to='/home' />
                )
              }
            />

            {/* ADMIN */}
            <Route
              exact
              path='/admin'
              element={
                isAuthenticated ? (
                  <AdminPage setAuth={setAuth} />
                ) : (
                  <Navigate to='/login' />
                )
              }
            />
            <Route
              exact
              path='/addAdmin'
              element={
                isAuthenticated ? (
                  <AddAdmin setAuth={setAuth} />
                ) : (
                  <Navigate to='/admin' />
                )
              }
            />

            {/* HOME */}
            <Route
              exact
              path='/home'
              element={
                isAuthenticated ? (
                  <Home setAuth={setAuth} />
                ) : (
                  <Navigate to='/login' />
                )
              }
            />

            {/* BORROWERS */}
            <Route
              exact
              path='/borrowers'
              element={
                isAuthenticated ? (
                  <Borrowers setAuth={setAuth} />
                ) : (
                  <Navigate to='/login' />
                )
              }
            />
            <Route
              exact
              path='/borrower/:id'
              element={
                isAuthenticated ? (
                  <Borrower setAuth={setAuth} />
                ) : (
                  <Navigate to='/login' />
                )
              }
            />
            <Route
              exact
              path='/editBorrower/:id'
              element={
                isAuthenticated ? (
                  <EditBorrower setAuth={setAuth} />
                ) : (
                  <Navigate to='/login' />
                )
              }
            />
            <Route
              exact
              path='/addBorrower'
              element={
                isAuthenticated ? (
                  <AddBorrower setAuth={setAuth} />
                ) : (
                  <Navigate to='/login' />
                )
              }
            />

            {/* LOANS */}
            <Route
              exact
              path='/loans'
              element={
                isAuthenticated ? (
                  <GetAllLoans setAuth={setAuth} />
                ) : (
                  <Navigate to='/login' />
                )
              }
            />
            <Route
              exact
              path='/addLoan/:id'
              element={
                isAuthenticated ? (
                  <AddLoan setAuth={setAuth} />
                ) : (
                  <Navigate to='/login' />
                )
              }
            />
            <Route
              exact
              path='/addLoan'
              element={
                isAuthenticated ? (
                  <AddLoans setAuth={setAuth} />
                ) : (
                  <Navigate to='/login' />
                )
              }
            />
            <Route
              exact
              path='/editLoan/:id'
              element={
                isAuthenticated ? (
                  <EditLoan setAuth={setAuth} />
                ) : (
                  <Navigate to='/login' />
                )
              }
            />

            {/* PAYMENTS */}
            <Route
              exact
              path='/payments'
              element={
                isAuthenticated ? (
                  <Payments setAuth={setAuth} />
                ) : (
                  <Navigate to='/login' />
                )
              }
            />
            <Route
              exact
              path="/addPayments/:Clientid?/:id?"
              element={
                isAuthenticated ? (
                  <PaymentLoansInfo setAuth={setAuth} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* MESSAGES */}
            <Route
              exact
              path='/emailClient'
              element={
                isAuthenticated ? (
                  <EmailPage setAuth={setAuth} />
                ) : (
                  <Navigate to='/login' />
                )
              }
            />
          </Routes>
        </Fragment>
      </div>
    </Router>
  );
}

export default App;
