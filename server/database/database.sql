CREATE DATABASE lending;

CREATE TABLE clients (
  id SERIAL PRIMARY KEY NOT NULL,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  contactNumber INT,
  email VARCHAR(255),
  address VARCHAR(255),
  username VARCHAR(255)
);

CREATE TABLE admin (
  id SERIAL PRIMARY KEY NOT NULL,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  contactNumber INT,
  email VARCHAR(255)L,
  address VARCHAR(255),
  password VARCHAR(255),
  username VARCHAR(255)
);

CREATE TABLE loans (
  id SERIAL PRIMARY KEY NOT NULL,
  client_id INT,
  balance NUMERIC(12,2),
  gross_loan NUMERIC(12,2),
  amort NUMERIC(12,2),
  terms INT,
  date_released TIMESTAMP WITHOUT TIME ZONE,
  maturity_date DATE,
  type VARCHAR(255),
  status VARCHAR(255),
  FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

CREATE TABLE payments(
  id SERIAL PRIMARY KEY NOT NULL,
  client_id INT,
  loan_id INT,
  amount NUMERIC(12,2),
  new_balance NUMERIC(12,2),
  collection_date TIMESTAMP WITHOUT TIME ZONE,
  collected_by VARCHAR(255),
  method VARCHAR(255),
  FOREIGN KEY (client_id) REFERENCES clients(client_id),
  FOREIGN KEY (loan_id) REFERENCES loans(loan_id)
);


-- JOINED DATA
SELECT * FROM clients INNER JOIN loans ON clients.client_id = loans.client_id;
--! SHOWS BOTH THAT HAS TRUE CONDITION

 SELECT * FROM clients AS c LEFT JOIN loans AS t ON c.client_id = l.client_id WHERE c.client_id = '94d5c3de-4a51-46d6-83cf-2e0a14d7a643';