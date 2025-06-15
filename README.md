

## 📘 MERN Task Management Application

A full-featured **Task Management App** built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). Features include:

* 🔐 User Authentication (JWT)
* 📝 Task CRUD operations
* 📌 Task filters, pagination, CSV export
* ✅ Task completion toggling
* 📥 Drag-and-drop task reordering (React Beautiful DnD)
* 📅 Due dates, categories, priorities
* 🛡 Secure, scalable REST API

---

## 📁 Folder Structure

```bash
App_internship/
├── backend/         # Node.js + Express.js + MongoDB
├── frontend/        # React.js with custom styles and API integration
├── README.md        # You're here!
```

---

## 📦 Backend Setup (Node + Express)

### 🔧 1. Install dependencies

```bash
cd backend
npm install
```

### 🔐 2. Configure `.env`

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret_key
```

### ▶️ 3. Run server

```bash
npm run dev  # using nodemon
```

---

### 📡 API Overview

| Route                   | Method | Auth | Description       |
| ----------------------- | ------ | ---- | ----------------- |
| `/api/auth/register`    | POST   | ✅    | Register user     |
| `/api/auth/login`       | POST   | ✅    | Login user        |
| `/api/tasks/`           | GET    | ✅    | Get all tasks     |
| `/api/tasks/`           | POST   | ✅    | Create task       |
| `/api/tasks/:id`        | PUT    | ✅    | Update task       |
| `/api/tasks/:id`        | DELETE | ✅    | Delete task       |
| `/api/tasks/:id/toggle` | PATCH  | ✅    | Toggle completion |
| `/api/tasks/reorder`    | PATCH  | ✅    | Reorder tasks     |

---

## 🎨 Frontend Setup (React)

### 🔧 1. Install dependencies

```bash
cd frontend
npm install
```

If you use `react-beautiful-dnd` and face a conflict, use:

```bash
npm install --legacy-peer-deps
```

### ▶️ 2. Start React App

```bash
npm start
```

---

### 📚 Key Features

#### 🔐 User Authentication

* JWT is stored in localStorage.
* Protected routes are guarded using `Authorization` header in Axios.

#### ✅ Task Features

* Task creation with title, description, dueDate, priority, category.
* Toggle complete/incomplete.
* Edit/delete tasks with modal.
* Export tasks to CSV using [papaparse](https://www.npmjs.com/package/papaparse).
* Search, filter by status & priority.
* Paginate results (5 per page).

#### 📦 Drag and Drop Reordering

* Implemented using `react-beautiful-dnd`.
* Tasks are re-ordered and backend updates task positions via PATCH `/api/tasks/reorder`.

---

## 🔐 GitHub & Deployment Commands

### 1. Git Initialization

```bash
git init
git add .
git commit -m "🚀 Initial commit"
```

### 2. GitHub SSH Setup

* Generate key:

  ```bash
  ssh-keygen -t ed25519 -C "your_email@example.com"
  ```

* Add the key to GitHub:
  [GitHub SSH Settings](https://github.com/settings/ssh/new)

* Set remote:

  ```bash
  git remote add origin git@github.com:USERNAME/REPO_NAME.git
  ```

### 3. Push to GitHub

```bash
git branch -M main
git push -u origin main
```

---

## 🧪 Testing the App

* ✅ Use [Thunder Client](https://www.thunderclient.com/) or Postman for backend testing
* ✅ Use browser + devtools for frontend testing
* ✅ Check token flow in `localStorage`

---

## 🛠 Troubleshooting

| Issue                          | Fix                                           |
| ------------------------------ | --------------------------------------------- |
| `react-beautiful-dnd` conflict | Use `--legacy-peer-deps`                      |
| 403 GitHub error               | Use SSH instead of HTTPS                      |
| Tasks not reordering           | Ensure `position` field exists and is updated |
| CORS error                     | Check backend uses `cors()` middleware        |

---

## 📌 Future Improvements

* 📱 Responsive design (mobile-first)
* 📊 Dashboard analytics
* 🔔 Real-time notifications (Socket.io)
* 📬 Email reminders via nodemailer
* 🧾 Task history / audit logs
* 📤 Vercel + Render for full deployment

---

## 👨‍💻 Author

**Rumi**
GitHub: [@faisal-jabbar](https://github.com/faisal-jabbar)
Internship Project — FAST University
June 2025


