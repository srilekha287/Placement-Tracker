# 📌 Placement Tracker – Microservices MERN Application

## 🚀 Overview

Placement Tracker is a scalable microservices-based placement management system built using the MERN stack.

It enables:
- 🎓 Students to create profiles and apply for jobs
- 🏢 Recruiters to post companies and manage applicants
- 📊 Real-time tracking of applications, interviews, and offers

The system follows a microservices architecture for scalability and maintainability.

---

## 🏗️ Architecture

This project follows a microservices design pattern.

### Services:
- 🔐 Auth Service  
- 🎓 Student Service  
- 🏢 Company Service  
- 📄 Application Service  
- 🌐 API Gateway  
- 💻 Frontend (React + Vite)


---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- JWT Authentication
- Microservices Architecture

### Database
- MongoDB
- MongoDB Atlas (Cloud Option)

### DevOps
- Docker (Containerization)
- Git & GitHub

---

## ✨ Features

### 👩‍🎓 Student
- Register & Login
- Complete profile (CGPA, skills, resume)
- Apply to companies
- Track:
  - Applied
  - Interview status
  - Selected / Rejected

### 🏢 Recruiter
- Register & Login
- Add company details
- View applicants
- Select / Reject candidates
- Track application statistics

### 🔐 Authentication
- JWT-based secure login
- Role-based access (Student / Recruiter / Admin)

---

## ⚙️ How to Run Locally (Without Docker)

###  Clone the repository

```bash
git clone https://github.com/srilekha287/Placement-Tracker.git
cd placement-tracker
```
### Install dependencies
```bash
cd backend/auth-service
npm install
```
- Reapeat it for all services
### Setup Environment Variables
```bash
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
```
### Start services
- Run each service seperately
  ```bash
  npm start or nodemon index.js
  ```
- Run frontend
  ```bash
  npm run dev
  ```
### What I Learned
- Designing microservices architecture
- Inter-service communication
- JWT-based role authentication
- Scalable database modeling
### Author
Srilekha Pandla
(Full Stack Developer (MERN))


