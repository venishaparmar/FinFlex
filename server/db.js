import mysql from 'mysql2/promise';

// Use createConnection without the .connect() method
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lending',
});

console.log('Connected to MySQL database');

export { connection };
