# 📝 Single Blog API Management System — Backend

A secure and scalable **Blog Management REST API** built with **Node.js, Express.js, MongoDB, JWT Authentication, Nodemailer, Multer, and Cloudinary**.

The API supports three roles — **Admin, Writer, and User** — with role-based access control, blog approval workflows, category management, Writer requests, image uploads, and email notifications.

---

## 🚀 Live Links

### Backend API

🔗 [View Live Backend API](https://blog-management-backend.vercel.app/)

### Frontend

🔗 [View Live Frontend](https://blog-management-frontend.vercel.app/)

---

# 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Nodemailer
* Multer
* Cloudinary
* Joi
* dotenv
* Cookie-based Authentication
* REST API

---

# 📁 Folder Structure

```text


────────────────────────────────────────────────────────────────────────────────

├── 📁 api/
│   └── 📄 index.js
├── 📁 src/
│   ├── 📁 config/
│   │   ├── 📄 cloudinaryConfig.js
│   │   ├── 📄 dbCon.js
│   │   └── 📄 mailConfig.js
│   ├── 📁 controller/
│   │   ├── 📄 blog.controller.js
│   │   ├── 📄 category.controller.js
│   │   ├── 📄 like.controller.js
│   │   ├── 📄 user.controller.js
│   │   └── 📄 userRequest.controller.js
│   ├── 📁 middleware/
│   │   └── 📄 authMiddleware.js
│   ├── 📁 models/
│   │   ├── 📄 blog.model.js
│   │   ├── 📄 category.model.js
│   │   ├── 📄 like.model.js
│   │   ├── 📄 otp.model.js
│   │   └── 📄 user.model.js
│   ├── 📁 router/
│   │   ├── 📄 auth.router.js
│   │   ├── 📄 blog.router.js
│   │   ├── 📄 category.router.js
│   │   ├── 📄 index.js
│   │   ├── 📄 like.router.js
│   │   └── 📄 userRequest.router.js
│   ├── 📁 utils/
│   │   ├── 📄 cloudinary.js
│   │   ├── 📄 generateSecretKey.js
│   │   ├── 📄 httpstatuscode.js
│   │   └── 📄 sendMail.js
│   ├── 📁 validation/
│   │   ├── 📄 blogSchema.js
│   │   ├── 📄 categorySchema.js
│   │   ├── 📄 index.js
│   │   └── 📄 userSchema.js
│   └── 📄 app.js
├── ⚙️ .gitignore
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 server.js
└── ⚙️ vercel.json

────────────────────────────────────────────────────────────────────────────────

```

> The folder structure follows a modular approach where routes, controllers, models, middleware, validation, configuration, and utility logic are separated.

---

# ✨ Features

## 🔐 1. User Authentication

The API provides secure authentication using **JWT and cookies**.

### Login Flow

```text
User
 ↓
Enter Email & Password
 ↓
Validate Request
 ↓
Find User
 ↓
Compare Password using bcrypt
 ↓
Generate JWT
 ↓
Set Authentication Cookie
 ↓
Login Successful
```

Passwords are hashed using **bcrypt** before being stored in MongoDB.

---

## 👥 2. Role-Based Access Control

The application supports three roles:

### 👑 Admin

Admin has the highest level of access.

Admin can:

* Manage blogs
* Approve/reject blogs
* Manage categories
* Manage Writer requests
* Manage users
* Access protected administrative APIs

### ✍️ Writer

Approved Writers can:

* Create blogs
* Update their blogs
* Delete their blogs
* Upload blog images
* Submit blogs for approval

### 👤 User

Normal Users can:

* View published blogs
* View categories
* Request Writer access
* Manage permitted profile operations

---

# 🛡️ 3. JWT Authentication Middleware

Protected APIs verify the user's JWT before processing the request.

```text
Request
 ↓
Check Authentication Cookie
 ↓
Verify JWT
 ↓
Get User Information
 ↓
Check Authorization
 ↓
Allow Request
```

If the token is missing or invalid, the API returns an appropriate authentication error.

---

# 🔑 4. Secret-Key Protection

Sensitive Admin/Writer operations are additionally protected using a secret key.

The frontend sends the secret key through:

```text
x-secret-key
```

The backend verifies the key before allowing the protected operation.

### Security Flow

```text
Request
 ↓
JWT Verification
 ↓
Secret-Key Verification
 ↓
Role Verification
 ↓
Controller
 ↓
Database
```

This provides an additional security layer for sensitive APIs.

---

# 📝 5. Blog Management

The backend provides complete CRUD operations for blogs.

### Blog Operations

* Create Blog
* Get All Blogs
* Get Blog By ID
* Update Blog
* Delete Blog

A blog can contain:

* Title
* Content
* Author
* Category
* Blog Image
* Status
* Created Date
* Updated Date

---

# ⏳ 6. Blog Approval Workflow

Blogs created by Writers are not immediately published.

They first go through an Admin approval process.

```text
Writer
 ↓
Create Blog
 ↓
Pending
 ↓
Admin Reviews
 ↓
 ┌──────────────┐
 ↓              ↓
Approve        Reject
 ↓              ↓
Approved       Rejected
 ↓
Published
```

This ensures that only approved content becomes publicly available.

---

# ✍️ 7. Writer Request System

A normal User can request to become a Writer.

### Workflow

```text
User
 ↓
Submit Writer Request
 ↓
Request Stored
 ↓
Admin Reviews Request
 ↓
 ┌───────────────┐
 ↓               ↓
Approve        Reject
 ↓               ↓
User becomes    Request
Writer          Rejected
```

After approval, the User receives Writer permissions.

---

# 📧 8. Email Notifications

**Nodemailer** is used to send email notifications for important actions.

For example:

```text
Writer Request
      ↓
Admin Approves / Rejects
      ↓
Email Notification
      ↓
User Receives Update
```

This improves communication between the Admin and Users.

---

# 🖼️ 9. Image Upload with Cloudinary

Blog images are uploaded using **Multer** and stored on **Cloudinary**.

### Upload Flow

```text
Frontend
 ↓
FormData
 ↓
Multer
 ↓
Image Processing
 ↓
Cloudinary
 ↓
Cloudinary Image URL
 ↓
MongoDB
```

The actual image file is stored on Cloudinary while the image URL is stored with the blog document in MongoDB.

---

# 🗂️ 10. Category Management

Admin can manage blog categories.

### Operations

* Create Category
* Get Categories
* Update Category
* Delete Category

Categories are associated with blogs.

```text
Category
   ↑
   │
Blog
```

This allows blogs to be organized and filtered by category.

---

# 👤 11. User Management

The backend manages users according to their roles and permissions.

A User document can contain information such as:

```text
name
email
password
phone
role
status
createdBy
createdAt
updatedAt
```

Passwords are securely hashed and are never stored as plain text.

---

# 🔎 12. Search & Filtering

The API can retrieve blog data based on different query parameters.

Examples include:

* Search blogs
* Filter by category
* Filter by status
* Filter by author

This allows the frontend to request only the required data.

---

# 📄 13. Pagination

Pagination is used when retrieving large amounts of data.

Example:

```text
Page 1 → Blogs 1–10
Page 2 → Blogs 11–20
Page 3 → Blogs 21–30
```

This reduces unnecessary database queries and data transfer.

---

# ✅ 14. Request Validation

Incoming data is validated before it reaches the controller logic.

Validation helps prevent invalid data from being stored in the database.

Examples:

* Required fields
* Email format
* Password validation
* Blog title validation
* Blog content validation
* Category validation

---

# 🚨 15. Centralized Error Handling

The backend handles errors through centralized error-handling middleware.

Common HTTP responses include:

```text
400 → Bad Request
401 → Unauthorized
403 → Forbidden
404 → Not Found
409 → Conflict
500 → Internal Server Error
```

Example response:

```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

This provides a consistent response format to the frontend.

---

# 🗄️ Database

The project uses **MongoDB** with **Mongoose** for database management.

The main collections are:

```text
Users
Blogs
Categories
UserRequests
```

---

## 👤 User Collection

The User collection stores authentication and account information.

Example structure:

```text
User
│
├── name
├── email
├── password
├── phone
├── role
├── status
├── createdBy
├── createdAt
└── updatedAt
```

### Role

```text
Admin
Writer
User
```

---

## 📝 Blog Collection

The Blog collection stores blog information.

Example structure:

```text
Blog
│
├── title
├── content
├── blog_image
├── author
├── category
├── status
├── createdAt
└── updatedAt
```

The `author` references the User collection.

The `category` references the Category collection.

---

## 🗂️ Category Collection

The Category collection stores available blog categories.

Example:

```text
Category
│
├── name
├── createdAt
└── updatedAt
```

---

## ✍️ User Request Collection

The User Request collection manages requests from Users who want to become Writers.

Example:

```text
UserRequest
│
├── user
├── status
├── createdAt
└── updatedAt
```

Possible request statuses:

```text
pending
approved
rejected
```

---

# 🔗 Database Relationships

The main relationships can be represented as:

```text
User
 │
 ├───────────────┐
 │               │
 ▼               ▼
Blog        UserRequest
 │
 ▼
Category
```

### Blog → User

A blog belongs to an author.

```text
Blog.author → User._id
```

### Blog → Category

A blog belongs to a category.

```text
Blog.category → Category._id
```

### UserRequest → User

A Writer request belongs to a User.

```text
UserRequest.user → User._id
```

---

# 🌐 API Structure

The APIs are organized into separate route groups.

### Authentication

```text
/api/auth
```

Handles authentication-related operations.

### Blogs

```text
/api/blogs
```

Handles blog management.

### Categories

```text
/api/categories
```

Handles category management.

### Writer Requests

```text
/api/user-request
```

Handles Writer request operations.

---

# 🔄 Complete Backend Request Flow

```text
Next.js Frontend
       ↓
Axios Request
       ↓
Express Route
       ↓
Authentication Middleware
       ↓
Secret-Key / Role Validation
       ↓
Request Validation
       ↓
Controller
       ↓
Mongoose
       ↓
MongoDB
       ↓
Response
       ↓
Frontend
```

---

# 🔒 Environment Variables

Create a `.env` file and add your required configuration:

```env
PORT=
MONGO_URI=
JWT_SECRET=
SECRET_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

EMAIL_USER=
EMAIL_PASSWORD=
```

⚠️ **Never upload your actual `.env` file to GitHub.**

Use `.env.example` for showing the required environment variables.

---

# 🚀 Installation

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Go to the Backend Folder

```bash
cd backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create `.env`

Add your MongoDB, JWT, Cloudinary, email, and secret-key configuration.

### 5. Start the Server

```bash
npm run dev
```

---

# 🧪 API Testing

The APIs can be tested using:

* Postman
* Thunder Client
* Frontend application

Authentication, protected routes, CRUD operations, image uploads, and role-based APIs can be tested through API clients.

---

# ☁️ Deployment

The backend is deployed on **Vercel**.

Database:

**MongoDB Atlas**

Image Storage:

**Cloudinary**

Email Service:

**Nodemailer**

### Deployment Flow

```text
GitHub
  ↓
Vercel
  ↓
Environment Variables
  ↓
Backend Deployment
  ↓
Live REST API
```

---

# 🧠 What I Learned

Through this project, I strengthened my understanding of:

* Node.js
* Express.js
* REST API development
* MongoDB
* Mongoose
* JWT Authentication
* Cookie-based Authentication
* bcrypt
* Role-Based Access Control
* Middleware
* Request Validation
* Centralized Error Handling
* CRUD Operations
* Cloudinary
* Multer
* Nodemailer
* Pagination
* Search & Filtering
* Database Relationships
* API Security
* Deployment

Most importantly, this project helped me understand how to build a **real-world backend API with authentication, authorization, database relationships, file uploads, email notifications, and role-based workflows.**

---

# 👩‍💻 Developer

## Madhumita Das

**B.Tech — Computer Science & Engineering**

Aspiring **MERN Stack / Full Stack Developer**

### Skills

```text
React
Next.js
Node.js
Express.js
MongoDB
TypeScript
JavaScript
```

---

## ⭐ Support

If you find this project useful or interesting, feel free to ⭐ the repository.

Thank you for checking out my project! 🙌
