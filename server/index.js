import express from 'express';
import bodyParser from 'body-parser';
import { connection as pool } from './db.js'; // Ensure this imports `connection` from `db.js`
import { generateJWT } from './utils/jwtGenerator.js';
import { auth } from './middlewares/auth.js';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());
const PORT = 8000;

// Helper function for MySQL query with Promise support
const query = async (sql, params) => {
  const [results] = await pool.query(sql, params); // Use `pool.query` correctly
  return results;
};

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await query(`SELECT * FROM admin WHERE username = ?`, [username]);

    if (admin.length === 0) {
      return res.status(401).send('Username or password is wrong');
    }

    // Directly compare passwords (no bcrypt)
    if (password !== admin[0].password) {
      return res.status(401).send('Username or password is wrong');
    }

    const token = generateJWT(admin[0]);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Server error');
  }
});

// Add Admin Route
app.post('/addAdmin', async (req, res) => {
  try {
    const { firstname, lastname, contactNumber, address, email, username, password } = req.body;

    const admin = await query(`SELECT * FROM admin WHERE username = ?`, [username]);
    if (admin.length > 0) {
      return res.status(401).send('User already exists');
    }

    const result = await query(
      `INSERT INTO admin (firstname, lastname, contactnumber, address, email, password, username) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [firstname, lastname, contactNumber, address, email, password, username]
    );

    const newAdmin = await query(`SELECT * FROM admin WHERE id = ?`, [result.insertId]);
    const token = generateJWT(newAdmin[0]);
    res.json({ token });
  } catch (error) {
    console.error('Add Admin error:', error);
    res.status(500).send('Server error');
  }
});

// Get all admins
app.get('/allAdmins', auth, async (req, res) => {
  try {
    const admins = await query(`SELECT * FROM admin`);
    res.json(admins);
  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).send('Server error');
  }
});

app.get('/profile', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log('Profile error:', error);
    res.status(500).send('Server error');
  }
});

//* CLIENTS
app.get('/allClients', auth, async (req, res) => {
  try {
    const getClient = await query(`SELECT * FROM clients`);

    res.json(getClient);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error fetching clients');
  }
});

app.get('/client/:id', auth, async (req, res) => {
  try {
    const id = req.params['id'];
    const getClient = await query(
      `SELECT * FROM clients WHERE id = ?`, [id]
    );

    if (getClient.length > 0) {
      res.json(getClient[0]);
    } else {
      res.status(404).send('Client not found');
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error fetching client');
  }
});

// Client Email
app.get('/email/:email', auth, async (req, res) => {
  try {
    const email = req.params['email'];
    const getClient = await query(
      `SELECT * FROM clients WHERE email = ?`, [email]
    );

    if (getClient.length > 0) {
      res.json(getClient[0]);
    } else {
      res.status(404).send('Client not found');
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error fetching client by email');
  }
});

// New Client
app.post('/addClient', async (req, res) => {
  try {
    const { firstname, lastname, contactNumber, address, email, username } = req.body;

    const user = await query(
      `SELECT * FROM clients WHERE username = ?`, [username]
    );

    if (user.length > 0) {
      return res.status(401).send('User already exists');
    }

    const newClient = await query(
      `INSERT INTO clients(firstname, lastname, contactnumber, address, email, username) 
       VALUES (?, ?, ?, ?, ?, ?)`, 
      [firstname, lastname, contactNumber, address, email, username]
    );

    res.json(newClient);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error adding new client');
  }
});

app.patch('/clients/:id', async (req, res) => {
  try {
    const id = req.params['id'];
    const { firstname, lastname, contactNumber, email, address } = req.body;

    const updateClient = await query(
      `UPDATE clients SET firstname = ?, lastname = ?, contactNumber = ?, address = ?, email = ? 
       WHERE id = ?`, 
      [firstname, lastname, contactNumber, address, email, id]
    );

    if (updateClient.affectedRows > 0) {
      res.json(updateClient);
    } else {
      res.status(404).send('Client not found');
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error updating client');
  }
});

app.delete('/clients/:id', async (req, res) => {
  try {
    const id = req.params['id'];
    const deleteClient = await query(
      `DELETE FROM clients WHERE id = ?`, [id]
    );

    if (deleteClient.affectedRows > 0) {
      res.json({ msg: `Deleted client with an id of ${id}` });
    } else {
      res.status(404).send('Client not found');
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error deleting client');
  }
});

//* LOANS

// Get all loans
app.get('/allLoans', auth, async (req, res) => {
  try {
    const getLoans = await query(
      `SELECT c.firstname, c.lastname, l.id, l.type, l.gross_loan, l.amort, l.terms, l.date_released, l.maturity_date, l.balance, l.status 
      FROM loans AS l 
      INNER JOIN clients AS c ON l.client_id = c.id`
    );

    res.json(getLoans);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error fetching loans');
  }
});

// Get loans of one client
app.get('/loans/:id', auth, async (req, res) => {
  try {
    const id = req.params['id'];
    const getClientLoans = await query(
      `SELECT c.firstname, c.id, l.id, l.type, l.gross_loan, l.amort, l.terms, l.date_released, l.maturity_date, l.balance, l.status, l.client_id 
      FROM loans AS l 
      INNER JOIN clients AS c ON l.client_id = c.id WHERE c.id = ?`,
      [id]
    );

    res.json(getClientLoans);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error fetching loans for this client');
  }
});

// Get loan
app.get('/loan/:id', auth, async (req, res) => {
  try {
    const id = req.params['id'];
    const getLoan = await query(
      `SELECT c.firstname, c.lastname, l.id, l.client_id, l.type, l.gross_loan, l.amort, l.terms, l.date_released, l.maturity_date, l.balance, l.status 
      FROM loans AS l 
      INNER JOIN clients AS c ON l.client_id = c.id WHERE l.id = ?`,
      [id]
    );

    if (getLoan.length > 0) {
      res.json(getLoan[0]);
    } else {
      res.status(404).send('Loan not found');
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error fetching loan');
  }
});

// Get loan's maturity date
app.get('/dates', auth, async (req, res) => {
  try {
    const getLoanDates = await query(
      `SELECT maturity_date FROM loans`
    );

    res.json(getLoanDates);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error fetching loan dates');
  }
});

// Create loan for borrower page
app.post('/loans/:id', auth, async (req, res) => {
  try {
    const id = req.params['id'];
    const { type, gross_loan, balance, amort, terms, date_released, maturity_date } = req.body;

    const newLoan = await query(
      `INSERT INTO loans(client_id, type, status, balance, gross_loan, amort, terms, date_released, maturity_date) 
      VALUES (?, ?, 'Pending', ?, ?, ?, ?, ?, ?)`,
      [id, type, balance, gross_loan, amort, terms, date_released, maturity_date]
    );

    res.json(newLoan);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error creating loan');
  }
});

// Create loan for loans page
app.post('/loans/', auth, async (req, res) => {
  try {
    const { client_id, type, status, gross_loan, balance, amort, terms, date_released, maturity_date } = req.body;

    const newLoan = await query(
      `INSERT INTO loans(client_id, type, status, balance, gross_loan, amort, terms, date_released, maturity_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [client_id, type, status, balance, gross_loan, amort, terms, date_released, maturity_date]
    );

    res.json(newLoan);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error creating loan');
  }
});

// Update loan
app.patch('/loans/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, balance, gross_loan, amort, terms, date_released, maturity_date, status } = req.body;

    const updateLoan = await query(
      `UPDATE loans 
      SET type = ?, balance = ?, gross_loan = ?, amort = ?, terms = ?, date_released = ?, maturity_date = ?, status = ? 
      WHERE id = ?`,
      [type, balance, gross_loan, amort, terms, date_released, maturity_date, status, id]
    );

    res.json(updateLoan);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error updating loan');
  }
});

// UPDATE LOAN PAYMENT
app.patch('/loan/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const updateLoanPayment = await query(
      `UPDATE loans 
      SET balance = (SELECT new_balance FROM payments WHERE payments.loan_id = ?)
      WHERE id = ?`,
      [id, id]
    );

    res.json(updateLoanPayment);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error updating loan payment');
  }
});

// Delete payment
app.delete('/payment/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const deletePayment = await query(
      `DELETE FROM payments WHERE id = ?`,
      [id]
    );

    if (deletePayment.affectedRows === 0) {
      res.json('You are not authorized to delete this payment');
    } else {
      res.json({ msg: `Deleted payment with an id of ${id}` });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error deleting payment');
  }
});

// Delete loan
app.delete('/loans/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const deleteLoan = await query(
      `DELETE FROM loans WHERE id = ?`,
      [id]
    );

    if (deleteLoan.affectedRows === 0) {
      res.json('You are not authorized to delete this loan');
    } else {
      res.json({ msg: `Deleted loan with an id of ${id}` });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error deleting loan');
  }
});

//* LOANS

// Get all loans
app.get('/allLoans', auth, async (req, res) => {
  try {
    const getLoans = await query(
      `SELECT c.firstname, c.lastname, l.id, l.type, l.gross_loan, l.amort, l.terms, l.date_released, l.maturity_date, l.balance, l.status 
      FROM loans AS l 
      INNER JOIN clients AS c ON l.client_id = c.id 
      WHERE c.id = l.client_id`
    );

    res.json(getLoans);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error fetching loans');
  }
});

// Get loans of one client
app.get('/loans/:id', auth, async (req, res) => {
  try {
    const id = req.params['id'];

    const getLoans = await query(
      `SELECT c.firstname, c.id, l.id, l.type, l.gross_loan, l.amort, l.terms, l.date_released, l.maturity_date, l.balance, l.status, l.client_id 
      FROM loans AS l 
      INNER JOIN clients AS c ON l.client_id = c.id 
      WHERE c.id = ?`, [id]
    );

    res.json(getLoans);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error fetching client loans');
  }
});

// Get loan
app.get('/loan/:id', auth, async (req, res) => {
  try {
    const id = req.params['id'];

    const getLoan = await query(
      `SELECT c.firstname, c.lastname, l.id, l.client_id, l.type, l.gross_loan, l.amort, l.terms, l.date_released, l.maturity_date, l.balance, l.status 
      FROM loans AS l 
      INNER JOIN clients AS c ON l.client_id = c.id 
      WHERE l.id = ?`, [id]
    );

    res.json(getLoan[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error fetching loan');
  }
});

// Get loan's maturity date
app.get('/dates', auth, async (req, res) => {
  try {
    const getLoans = await query(
      `SELECT maturity_date FROM loans`
    );

    res.json(getLoans);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error fetching loan dates');
  }
});

// Create loan for borrower page
app.post('/loans/:id', auth, async (req, res) => {
  try {
    const id = req.params['id'];
    const {
      type,
      gross_loan,
      balance,
      amort,
      terms,
      date_released,
      maturity_date,
    } = req.body;

    const newLoan = await query(
      `INSERT INTO loans (client_id, type, status, balance, gross_loan, amort, terms, date_released, maturity_date) 
      VALUES (?, ?, 'Pending', ?, ?, ?, ?, ?, ?)`, 
      [id, type, balance, gross_loan, amort, terms, date_released, maturity_date]
    );

    res.json(newLoan);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error creating loan');
  }
});

// Create loan for loans page
app.post('/loans/', auth, async (req, res) => {
  try {
    const {
      client_id,
      type,
      status,
      gross_loan,
      balance,
      amort,
      terms,
      date_released,
      maturity_date,
    } = req.body;

    const newLoan = await query(
      `INSERT INTO loans (client_id, type, status, balance, gross_loan, amort, terms, date_released, maturity_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [client_id, type, status, balance, gross_loan, amort, terms, date_released, maturity_date]
    );

    res.json(newLoan);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error creating loan');
  }
});

// Update loan
app.patch('/loans/:id', auth, async (req, res) => {
  try {
    const id = req.params['id'];
    const {
      type,
      balance,
      gross_loan,
      amort,
      terms,
      date_released,
      maturity_date,
      status,
    } = req.body;

    const updateLoan = await query(
      `UPDATE loans SET type = ?, balance = ?, gross_loan = ?, amort = ?, terms = ?, date_released = ?, maturity_date = ?, status = ? 
      WHERE id = ?`, 
      [type, balance, gross_loan, amort, terms, date_released, maturity_date, status, id]
    );

    res.json(updateLoan);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error updating loan');
  }
});

// Update loan payment
app.patch('/loan/:id', auth, async (req, res) => {
  try {
    const id = req.params['id'];

    const updateLoan = await query(
      `UPDATE loans SET balance = payments.new_balance 
      FROM payments WHERE payments.loan_id = ?`, 
      [id]
    );

    res.json(updateLoan);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error updating loan payment');
  }
});

// Delete loan
app.delete('/loans/:id', auth, async (req, res) => {
  try {
    const id = req.params['id'];

    const deleteLoan = await query(
      `DELETE FROM loans WHERE id = ?`, [id]
    );

    res.json({ msg: `Deleted loan with an id of ${id}` });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error deleting loan');
  }
});






app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// import express from 'express';
// import bodyParser from 'body-parser';
// import { connection } from './db.js';
// import bcrypt from 'bcryptjs';
// import { generateJWT } from './utils/jwtGenerator.js';
// import { auth } from './middlewares/auth.js';
// import cors from 'cors';
// const pool = connection();
// const app = express();

// app.use(bodyParser.json());
// app.use(cors());

// const PORT = 8000;

// //* LOGIN SESSIONS
// //! AUTHENTICATION ROUTES

// app.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // console.log(req.body);
//     const admin = await pool.query(
//       `SELECT * FROM admins WHERE username = '${username}'`
//     );

//     if (admin.rows.length <= 0) {
//       res.status(401).send('Username or password is wrong');
//     }

//     const validPassword = await bcrypt.compare(
//       password,
//       admin.rows[0].password
//     );

//     if (!validPassword) {
//       res.status(401).send('Username or password is wrong');
//     }
//     const token = generateJWT(admin.rows[0]);

//     res.json({ token });
//   } catch (error) {
//     console.log(error);
//   }
// });

// app.post('/addAdmin', async (req, res) => {
//   try {
//     const {
//       firstname,
//       lastname,
//       contactNumber,
//       address,
//       email,
//       username,
//       password,
//     } = req.body;

//     const admin = await pool.query(
//       `SELECT * FROM admins WHERE username = '${username}'`
//     );

//     if (admin.rows.length > 0) {
//       res.status(401).send('User already exist');
//     }

//     // bcrypt
//     const saltRound = 10;
//     const salt = await bcrypt.genSalt(saltRound);

//     const bcryptPassword = await bcrypt.hash(password, salt);

//     const newAdmin = await pool.query(
//       `INSERT INTO admins (firstname, lastname, contactnumber, address, email, password, username) VALUES ('${firstname}', '${lastname}', ${contactNumber}, '${address}', '${email}', '${bcryptPassword}', '${username}') RETURNING *`
//     );

//     const token = generateJWT(newAdmin.rows[0]);

//     res.json({ token });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //! PRIVATE ROUTES
// //* ADMIN
// app.post('/register', async (req, res) => {
//   try {
//     const {
//       firstname,
//       lastname,
//       contactNumber,
//       address,
//       email,
//       username,
//       password,
//     } = req.body;

//     const admin = await pool.query(
//       `SELECT * FROM admins WHERE username = '${username}'`
//     );

//     if (admin.rows.length > 0) {
//       res.status(401).send('User already exist');
//     }

//     // bcrypt
//     const saltRound = 10;
//     const salt = await bcrypt.genSalt(saltRound);

//     const bcryptPassword = await bcrypt.hash(password, salt);

//     const newAdmin = await pool.query(
//       `INSERT INTO admins (firstname, lastname, contactnumber, address, email, password, username) VALUES ('${firstname}', '${lastname}', ${contactNumber}, '${address}', '${email}', '${bcryptPassword}', '${username}') RETURNING *`
//     );

//     const token = generateJWT(newAdmin.rows[0]);

//     res.json({ token });
//   } catch (error) {
//     console.log(error);
//   }
// });
// app.get('/profile', auth, async (req, res) => {
//   try {
//     res.json(req.user);
//   } catch (error) {
//     console.log(err);
//   }
// });

// app.get('/allAdmins', auth, async (req, res) => {
//   try {
//     const getAdmin = await pool.query(`SELECT * FROM admins`);

//     res.json(getAdmin.rows);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// app.delete('/admins/:id', async (req, res) => {
//   try {
//     const id = req.params['id'];
//     await pool.query(`DELETE FROM admins WHERE id = ${id}`);

//     res.json({ msg: `Deleted admin with an id of ${id}` });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //* CLIENTS
// app.get('/allClients', auth, async (req, res) => {
//   try {
//     const getClient = await pool.query(`SELECT * FROM clients`);

//     res.json(getClient.rows);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// app.get('/client/:id', auth, async (req, res) => {
//   try {
//     const id = req.params['id'];
//     const getClient = await pool.query(
//       `SELECT * FROM clients WHERE id = ${id};`
//     );

//     res.json(getClient.rows[0]);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// // Client Email
// app.get('/email/:email', auth, async (req, res) => {
//   try {
//     const email = req.params['email'];
//     const getClient = await pool.query(
//       `SELECT * FROM clients WHERE email = '${email}';`
//     );

//     res.json(getClient.rows[0]);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// // New Client
// app.post('/addClient', async (req, res) => {
//   try {
//     const { firstname, lastname, contactNumber, address, email, username } =
//       req.body;

//     const user = await pool.query(
//       `SELECT * FROM clients WHERE username = '${username}'`
//     );

//     if (user.rows.length > 0) {
//       res.status(401).send('User already exist');
//     }

//     const newClient = await pool.query(
//       `INSERT INTO clients(firstname, lastname, contactnumber, address, email,  username) VALUES ('${firstname}', '${lastname}', ${contactNumber}, '${address}', '${email}', '${username}') RETURNING *`
//     );

//     res.json(newClient);
//   } catch (error) {
//     console.log(error);
//   }
// });

// app.patch('/clients/:id', async (req, res) => {
//   try {
//     const id = req.params['id'];
//     const { firstname, lastname, contactNumber, email, address } = req.body;

//     // const updateClient = await pool.query(
//     //   `UPDATE clients SET firstname = '${firstname}', lastname = '${lastname}', contactNumber = '${contactNumber}', email = '${email}', address = '${address}' WHERE id = ${id} RETURNING *`

//     const updateClient = await pool.query(
//       `UPDATE clients SET firstname = '${firstname}', lastname = '${lastname}', contactNumber = ${contactNumber}, address = '${address}', email = '${email}' WHERE id = ${id} RETURNING *;`
//     );

//     res.json(updateClient.rows);
//   } catch (error) {
//     console.log(error);
//   }
// });

// app.delete('/clients/:id', async (req, res) => {
//   try {
//     const id = req.params['id'];
//     await pool.query(`DELETE FROM clients WHERE id = ${id}`);

//     res.json({ msg: `Deleted client with an id of ${id}` });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //* LOANS

// // Get all loans
// app.get('/allLoans', auth, async (req, res) => {
//   try {
//     const getLoans = await pool.query(
//       `SELECT c.firstname, c.lastname, l.id, l.type, l.gross_loan, l.amort, l.terms, l.date_released, l.maturity_date, l.balance, l.status FROM loans AS l INNER JOIN clients AS c ON l.client_id = c.id WHERE c.id = l.client_id`
//     );

//     res.json(getLoans.rows);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// // Get loans of one client
// app.get('/loans/:id', auth, async (req, res) => {
//   try {
//     const id = req.params['id'];

//     const getClient = await pool.query(
//       `SELECT c.firstname, c.id, l.id, l.type, l.gross_loan, l.amort, l.terms, l.date_released, l.maturity_date, l.balance, l.status, l.client_id FROM loans AS l INNER JOIN clients AS c ON l.client_id = c.id WHERE c.id = '${id}'`
//     );

//     res.json(getClient.rows);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// // Get loan
// app.get('/loan/:id', auth, async (req, res) => {
//   try {
//     const id = req.params['id'];

//     const getLoan = await pool.query(
//       `SELECT c.firstname, c.lastname, l.id, l.client_id, l.type, l.gross_loan, l.amort, l.terms, l.date_released, l.maturity_date, l.balance, l.status FROM loans AS l INNER JOIN clients AS c ON l.client_id = c.id WHERE l.id = '${id}'`
//     );

//     res.json(getLoan.rows[0]);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// // Get loan's maturity date
// app.get('/dates', auth, async (req, res) => {
//   try {
//     const id = req.params['id'];

//     const getLoan = await pool.query(`SELECT maturity_date FROM loans`);

//     res.json(getLoan.rows);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// // Create loan for borrower page
// app.post('/loans/:id', auth, async (req, res) => {
//   try {
//     const id = req.params['id'];

//     const {
//       type,
//       gross_loan,
//       balance,
//       amort,
//       terms,
//       date_released,
//       maturity_date,
//     } = req.body;

//     const newLoan = await pool.query(
//       `INSERT INTO loans(client_id, type, status, balance, gross_loan, amort, terms, date_released, maturity_date) VALUES (${id}, '${type}', 'Pending', ${balance}, ${gross_loan}, ${amort}, ${terms}, '${date_released}', '${maturity_date}') RETURNING *`
//     );

//     res.json(newLoan.rows[0]);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// // Create loan for loans page
// app.post('/loans/', auth, async (req, res) => {
//   try {
//     const {
//       client_id,
//       type,
//       status,
//       gross_loan,
//       balance,
//       amort,
//       terms,
//       date_released,
//       maturity_date,
//     } = req.body;

//     const newLoan = await pool.query(
//       `INSERT INTO loans(client_id, type, status, balance, gross_loan, amort, terms, date_released, maturity_date) VALUES (${client_id}, '${type}', '${status}',${balance}, ${gross_loan}, ${amort}, ${terms}, '${date_released}', '${maturity_date}') RETURNING *`
//     );

//     res.json(newLoan.rows[0]);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// // Update loan
// app.patch('/loans/:id', auth, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const {
//       type,
//       balance,
//       gross_loan,
//       amort,
//       terms,
//       date_released,
//       maturity_date,
//       status,
//     } = req.body;

//     const updateLoan = await pool.query(
//       `UPDATE loans SET type = '${type}', balance = '${balance}', gross_loan = ${gross_loan}, amort = ${amort}, terms = ${terms}, date_released = '${date_released}', maturity_date = '${maturity_date}', status = '${status}' WHERE id = ${id} RETURNING *`
//     );

//     // If id is not the real user
//     // if (updateLoan.rows.length === 0) {
//     //   return res.json('This loan is not yours');
//     // }

//     // console.log(updateLoan.rows);
//     res.json(updateLoan.rows);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// // UPDATE LOAN PAYMENT
// app.patch('/loan/:id', auth, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updateLoan = await pool.query(
//       `UPDATE loans SET balance = payments.new_balance FROM payments WHERE payments.loan_id = ${id} RETURNING *`
//     );

//     // If id is not the real user
//     // if (updateLoan.rows.length === 0) {
//     //   return res.json('This loan is not yours');
//     // }

//     // console.log(updateLoan.rows);
//     res.json(updateLoan.rows);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// // Delete payment
// app.delete('/payment/:id', auth, async (req, res) => {
//   try {
//     // const id = req.params['id'];
//     const { id } = req.params;
//     // console.log(id);
//     // console.log(req.user.id);
//     const deletePayment = await pool.query(
//       `DELETE FROM payments WHERE id = ${id} RETURNING * `
//     );

//     if (deletePayment.rows.length === 0) {
//       res.json('You are not authorize to delete loan');
//     }

//     res.json({ msg: `Deleted payment with an id of ${id}` });
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// // Delete loan
// app.delete('/loans/:id', auth, async (req, res) => {
//   try {
//     // const id = req.params['id'];
//     const { id } = req.params;
//     // console.log(id);
//     // console.log(req.user.id);
//     const deleteLoan = await pool.query(
//       `DELETE FROM loans WHERE id = ${id} RETURNING * `
//     );

//     if (deleteLoan.rows.length === 0) {
//       res.json('You are not authorize to delete loan');
//     }

//     res.json({ msg: `Deleted loan with an id of ${id}` });
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// //* PAYMENTS
// // View all payments
// app.get('/allPayments', auth, async (req, res) => {
//   try {
//     const getPayments = await pool.query(
//       `SELECT c.firstname, c.lastname, p.id, p.amount, p.collection_date, p.new_balance, p.collected_by, p.method, p.loan_id FROM payments AS p INNER JOIN clients AS c ON p.client_id = c.id WHERE c.id = p.client_id`
//     );

//     res.json(getPayments.rows);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// // View all client payments to single loan
// app.get('/payments/:id', auth, async (req, res) => {
//   try {
//     const id = req.params['id'];

//     const getPayments = await pool.query(
//       // `SELECT p.loan_id, l.type, l.gross_loan, l.amort, l.terms, l.date_released, l.maturity_date, l.balance, l.status, p.id, p.amount, p.collection_date, p.new_balance, p.collected_by, p.method FROM payments AS p INNER JOIN loans AS l ON p.loan_id = l.id WHERE l.id = ${id};`
//       `SELECT * FROM payments WHERE client_id = ${id};`
//     );

//     res.json(getPayments.rows);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// // Create payment for single loan
// app.post('/payments/:id', auth, async (req, res) => {
//   try {
//     const id = req.params['id'];

//     const {
//       amount,
//       collection_date,
//       collected_by,
//       new_balance,
//       method,
//       client_id,
//     } = req.body;

//     const addPayment = await pool.query(
//       `INSERT INTO PAYMENTS (amount, collection_date, collected_by, new_balance, method, client_id, loan_id) VALUES (${amount}, '${collection_date}', '${collected_by}', ${new_balance}, '${method}', ${client_id}, ${id}) RETURNING *`
//     );

//     res.json(addPayment.rows[0]);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// app.post('/loans/', auth, async (req, res) => {
//   try {
//     const {
//       amount,
//       collection_date,
//       collected_by,
//       new_balance,
//       method,
//       loan_id,
//     } = req.body;

//     const addPayment = await pool.query(
//       `INSERT INTO payments (amount, collection_date, collected_by, new_balance, method, loan_id) VALUES (${amount}, '${collection_date}', '${collected_by}', ${new_balance}, '${method}', ${loan_id}) RETURNING *`
//     );

//     res.json(addPayment.rows[0]);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// // PAYMENT W. CLIENT ID AND LOAN ID
// app.get('/payment/:client/:loan', auth, async (req, res) => {
//   try {
//     const client_id = req.params['client'];
//     const loan_id = req.params['loan'];

//     const getPayments = await pool.query(
//       `SELECT * FROM payments WHERE client_id = ${client_id} AND loan_id = ${loan_id};`
//     );

//     res.json(getPayments.rows);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// //
// pool.connect((err) => {
//   if (err) {
//     console.log(err.message);
//   }
//   {
//     app.listen(PORT, () => {
//       console.log(`Server has started on http://localhost:${PORT}`);
//     });
//   }
// });
