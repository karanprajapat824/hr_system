# Employee Leave & Attendance Management System (Mini HR Tool)

## 📌 Project Overview

This project is a Mini HR Management System built to manage employee attendance and leave workflows in a simple, secure, and role-based manner.

The system supports two roles:

- Employee
- Admin

Employees can:

- Register and log in securely
- Mark daily attendance (check-in / check-out)
- Apply for different types of leaves (Casual, Sick, Paid)
- View leave history and attendance records
- Track remaining leave balance per category

Admins can:

- View all employees
- Monitor attendance of all employees
- Approve, reject, or review leave requests
- Access overall dashboard insights

The project focuses on correct business logic, role-based authorization, and a clean full-stack implementation.

---

## 🛠 Tech Stack & Justification

### Frontend

- React (Vite) – Fast development, modern tooling, component-based architecture

### Backend

- Node.js + Express – Lightweight, scalable REST API development

### Database

- MongoDB (Mongoose) – Flexible schema design and easy relationship handling

### Authentication

- JWT (Access & Refresh Tokens) – Secure, stateless authentication

### Architecture

- MERN Stack – Industry-standard full-stack architecture

### Styling

-Used for responsive UI, clean layouts, and smooth user experience.

---

## ⚙️ Installation Steps

Clone the repository
`git clone https://github.com/karanprajapat824/hr_system.git`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on: http://localhost:5173

### Backend

```bash
cd backend
npm install
node index.js
```

Runs on: http://localhost:4040

---

## 🔐 Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=4040
CLIENT_URL=https://hr-system-eta-eight.vercel.app/
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/
ACCESS_TOKEN_SECRET=access_123
REFRESH_TOKEN_SECRET=refress_123
NODE_ENV=production
```

### Variable Usage

- PORT: Backend server port
- CLIENT_URL: Frontend URL for CORS and cookies
- MONGODB_URL: MongoDB connection string
- ACCESS_TOKEN_SECRET: JWT access token secret
- REFRESH_TOKEN_SECRET: JWT refresh token secret
- NODE_ENV: Environment mode

---

## 🔗 API Endpoints

### Authentication

- POST /signup – Register user or employee
- POST /signin – Login user or employee or admin as well
- GET /signout – Logout user or employee or admin
- GET /refresh – Refresh JWT token

### Employee Routes

- GET /user-info - get employee dashboard data
- GET /profile - get employee profile data
- GET /checkin - checkin the employee today present
- GET /checkout - chechout the employee toady is complte
- GET /remaining-leave - check and get total remainining leave left
- GET /leave-history - leave can check there leave history with date,checkin,cheout,status
- GET /attendance : get employee attendance
- POST /apply-leave - employee can apply for leave , leave type , date , total days include
- POST /cancel-leave - employee can cancel pending leaves

### Admin Routes

- GET /dashboard - get admin dashboard data
- GET /leaveStatus - give approve and rejection of pending leaves
- GET /employees - get all employe data and manage them
- GET /attendance - get all employee attendance data

---

### 🔐 Authorization Middleware

- isUser → Allows access only to authenticated employees
- isAdmin → Allows access only to admin users

## 🗄 Database Models

### User

- Stores employees and admins
- Role-based access
- Leave balance per category (Casual, Sick, Paid)

### Leave

- Leave type: CASUAL, SICK, PAID
- Status: PENDING, APPROVED, REJECTED, CANCELLED
- Tracks approval history

### Attendance

- Daily check-in / check-out
- Attendance status

Relationships:

- One User → Many Leaves
- One User → Many Attendance records

---

## 🔑 Admin Credentials

Email: karanprajapat824@gmail.com  
Password: 12345678

---

## 🤖 AI Tools Declaration

- ChatGPT used for:
  - Code auto-completion
  - CSS responsiveness
  - Color theme selection
  - Faster development

All core logic and decisions were implemented manually.

---

## ⚠️ Known Limitations

- Basic UI and animations
- No email notifications
- No unit testing
- Beginner-level MVP

---

## ⏱ Time Spent

Approximate time spent: 10–12 hours

## public url 
- frontend : ```https://hr-system-eta-eight.vercel.app/```
- backend : ```https://hr-system-3tks.onrender.com```
