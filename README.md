Here's the **updated README.md** including **caching with Redis** and **rate limiting using express-rate-limit**:

---

# 📚 Online Bookstore (E-commerce Platform) - MEAN Stack Project

## 🚀 Project Overview
The **Online Bookstore** is a full-stack e-commerce web application built using the **MEAN stack** (MongoDB, Express.js, Angular, and Node.js). This platform allows users to browse books, add them to a cart, place orders, and leave reviews. Admins can manage books and orders efficiently.

This project demonstrates real-world **e-commerce functionalities**, incorporating best practices in **authentication, authorization, caching, rate limiting, payment integration, and deployment**.

---

## ✨ Features

### 🖥️ Backend (Node.js + Express.js + MongoDB)
- **User Authentication & Authorization**: JWT-based authentication, role-based access control (admin vs. user).
- **RESTful API**: Well-structured endpoints for user, book, cart, order, and review management.
- **Database Design**: MongoDB with Mongoose schemas, defining relationships among users, books, orders, and reviews.
- **Middleware**:
  - JWT authentication
  - Error handling
  - Logging (`winston` or `morgan`)
  - **Rate Limiting**: Protect API routes from excessive requests using `express-rate-limit`.
- **Caching**:
  - **Redis caching** for frequently accessed data (e.g., book list, user sessions).
  - Improves performance and reduces database load.
- **Advanced Features**:
  - Password hashing using `bcrypt.js`
  - Pagination and filtering
  - Transactions for order processing
- **File Handling**: Upload book covers using `multer`.
- **Validation**: Input validation using `Joi` and Mongoose schema validations.

### 🌐 Frontend (Angular)
- **User Interface**: Responsive UI using **Angular Material**.
- **Authentication**: Login, registration, and JWT session management.
- **Bookstore Features**:
  - Search and filter books
  - Book details with reviews
  - Cart & checkout process
  - Order history
- **Review System**: Users can add, edit, and delete reviews.
- **Performance Enhancements**:
  - Lazy loading of Angular modules
  - Server-side pagination

### 💡 Additional Features
- **Payment Integration**: Stripe integration for secure online payments.
- **Email Notifications**: Send transactional emails using `nodemailer`.

---

## 🛠️ Getting Started

### 📌 Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Redis](https://redis.io/) (for caching)
- [Angular CLI](https://angular.io/cli) (latest)
- [Git](https://git-scm.com/)

### 🔧 Installation & Setup

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-repo/Online-Bookstore.git
cd Online-Bookstore
```

#### 2️⃣ Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the **backend** folder and add:
```env
MONGO_URI=
PORT=
JWT_SECRET=
STRIPE_SECRET_KEY=
FRONTEND_URL=
REDIS_HOST=localhost
REDIS_PORT=6379
EMAIL_USER=
EMAIL_FROM=
```
Run the backend server:
```bash
npm run dev
```

#### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm start
```
The frontend will be available at: `http://localhost:4200`

---

## 📜 API Documentation
Use **Postman** or **Bruno** to test API endpoints. Sample endpoints:

### **Auth Routes**
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive a JWT token
- `GET /api/auth/me` - Get current user details

### **Books Routes**
- `GET /api/books` - Get all books (with **Redis caching**, pagination, and filtering)
- `POST /api/books` - Add a new book (Admin only)
- `PUT /api/books/:id` - Update book details (Admin only)
- `DELETE /api/books/:id` - Delete a book (Admin only)

### **Order Routes**
- `POST /api/orders` - Place an order
- `GET /api/orders/user` - Get orders for the logged-in user
- `GET /api/orders/admin` - Get all orders (Admin only)

---

## 🚀 Performance Optimizations

### **🔄 Redis Caching**
Redis is used to **cache frequently accessed data** like:
- Book listings (`/api/books`) to reduce database queries.
- User session data for faster authentication.
  
---

### **⏳ API Rate Limiting**
To **prevent abuse**, we use `express-rate-limit` to restrict excessive API requests.

---

## 🛠️ Deployment
- **Backend**: Deployed on **Heroku/Vercel** with MongoDB Atlas.
- **Frontend**: Deployed on **Vercel/Netlify**.
- **Redis**: Hosted using **Redis Cloud** for production.

---

## 👥 Team Members
- **Abdelaziiz Gohaar** ([GitHub](https://github.com/AbdelaziizGohaar))
- **Mahmoud Elbanna** ([GitHub](https://github.com/mahmoud-elbanna53))
- **Arwa Mohammed** ([GitHub](https://github.com/Arwa-Mohamed23))
- **Youssef Medhat** ([GitHub](https://github.com/youssef-medhatt))
- **Moamen Ayman** ([GitHub](https://github.com/Moamenaymannn))
