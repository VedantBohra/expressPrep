# Express.js Backend Challenges

This document contains **Easy, Medium, and Hard level challenges** to practice backend development with Express.js.  
All challenges can be tested with **Postman** (except WebSockets which need a client).

---

## 🟢 Easy Level (Basics & Fundamentals)

### 1. Basic CRUD API (Users)
- Create an Express server with routes:
  - `GET /users`
  - `POST /users`
  - `PUT /users/:id`
  - `DELETE /users/:id`
- Store data in memory (array).

### 2. Query Params & Filtering
- `GET /users?age=25` → returns only users of a given age.
- `GET /users?sort=asc` → sorts users by name.

### 3. Middleware Practice
- Create a middleware that logs:
  - request method
  - URL
  - timestamp  
- Apply it to all routes.

### 4. Error Handling Middleware
- Add centralized error handler:
  - 404 for invalid routes
  - 500 for internal errors

### 5. Environment Variables
- Use **dotenv** to configure:
  - server port
  - app name (from `.env`)

---

## 🟡 Medium Level (Realistic API Features)

### 1. Authentication with JWT
- `POST /login` issues a JWT if username/password matches mock user data.
- Protect `GET /profile` so it only works with a valid JWT.

### 2. Validation
- Add input validation for `POST /users` using **express-validator** or custom middleware.
- Rules:
  - `name`: string, min 3 chars
  - `email`: valid email
  - `age`: 18–99

### 3. Pagination & Search
- `GET /users?page=2&limit=5&search=John`  
  → return paginated + filtered results.

### 4. File Uploads
- Implement `POST /upload` using **multer**.
- Accept profile picture uploads.
- Return file details in response.
- Also have a `GET /profile-pic` to access the stored upload.

### 5. Rate Limiting Middleware
- Add middleware to block a client if they make more than 5 requests per minute.

---

## 🔴 Hard Level (Advanced Backend Scenarios)

### 1. Role-Based Access Control (RBAC)
- Extend JWT auth with user roles: `admin`, `user`.
- Only `admin` can access `DELETE /users/:id`.

### 2. Nested Resources (Relationships)
- Create APIs for posts & comments:
  - `POST /posts/:id/comments`
  - `GET /posts/:id/comments`
- Store comments inside the corresponding post.

### 3. Caching Layer
- Implement caching for `GET /users`:
  - Use in-memory store (e.g., `Map`) or Redis.
  - If data is cached, return from cache.

### 4. Transactions / Rollback Simulation
- Implement `POST /transfer` for money transfers between two users.
- If balance is insufficient → rollback transaction.
- Simulate with in-memory users having balances.

### 5. WebSockets Integration (Chat Simulation)
- Add basic WebSocket (or Socket.IO) integration for real-time messaging.
- Clients can:
  - join a room
  - send messages
  - broadcast messages to all in the room

---

👉 Use **Postman** for REST APIs.  
👉 For **WebSockets**, use Socket.IO client or Postman’s WebSocket feature.