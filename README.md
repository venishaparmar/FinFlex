# Project Directory Structure

```plaintext
venishaparmar-FinFlex/
├── client/
│   ├── package-lock.json
│   ├── package.json
│   ├── tailwind.config.js
│   └── src/
│       ├── App.css
│       ├── App.js
│       ├── App.test.js
│       ├── index.css
│       ├── index.js
│       ├── reportWebVitals.js
│       ├── setupTests.js
│       └── components/
│           ├── LogoutButton.jsx
│           ├── auths/
│           │   ├── Login.jsx
│           │   └── Register.jsx
│           ├── dashboard/
│           │   ├── admin/
│           │   │   ├── AddAdmin.jsx
│           │   │   ├── AdminPage.jsx
│           │   │   └── AllAdmins.jsx
│           │   └── pages/
│           │       ├── borrowers/
│           │       │   ├── AddBorrower.jsx
│           │       │   ├── Borrower.jsx
│           │       │   ├── Borrowers.jsx
│           │       │   └── EditBorrower.jsx
│           │       ├── home/
│           │       │   ├── Home.jsx
│           │       │   ├── bottom/
│           │       │   │   ├── ApprovalWidget.jsx
│           │       │   │   ├── BotWidget.jsx
│           │       │   │   └── DatesWidget.jsx
│           │       │   └── top/
│           │       │       └── TopWidget.jsx
│           │       ├── loans/
│           │       │   ├── AddLoan.jsx
│           │       │   ├── AddLoans.jsx
│           │       │   ├── ClientLoans.jsx
│           │       │   ├── EditLoan.jsx
│           │       │   ├── Loan.jsx
│           │       │   └── OneLoan.jsx
│           │       ├── messages/
│           │       │   ├── EmailPage.jsx
│           │       │   ├── GetBorrowers.jsx
│           │       │   └── Message.jsx
│           │       └── payments/
│           │           ├── AddPayments.jsx
│           │           ├── AllPayments.jsx
│           │           ├── ListPayments.jsx
│           │           └── PaymentLoanInfo.jsx
│           ├── landing/
│           │   └── Landing.jsx
│           └── sidebar/
│               └── Sidebar.jsx
└── server/
    ├── db.js
    ├── index.js
    ├── package-lock.json
    ├── package.json
    ├── database/
    │   ├── ER.PNG
    │   └── database.sql
    ├── middlewares/
    │   └── auth.js
    └── utils/
        └── jwtGenerator.js
