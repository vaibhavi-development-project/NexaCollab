NexaCollab

A full-stack collaboration portal enabling workspace-based access, real-time member management, RBAC (Role-Based Access Control), and efficient handling of tasks, documents, and activity logs.

📌 Overview

NexaCollab is designed to help teams collaborate inside isolated workspaces where members can:

Create and manage tasks
Maintain documents
Track activity logs
Manage team members & roles
Get real-time updates via WebSockets
✨ Features
🧩 Workspace System
Create multiple workspaces
Role-based access (Owner / Admin / Member)
Secure workspace isolation
📋 Tasks Module

Create and manage tasks inside a workspace:

➕ Create New Task
📝 Title & Description
📊 Status:
Todo
In Progress
Done
🚦 Priority:
High
Medium
Low
👤 Assign tasks to users via email
📄 Documents Module
Create and manage workspace documents
Simple editor-style structure
Version-ready design for future upgrades
📡 Activity Logs

Tracks everything happening inside workspace:

Member joins/leaves
Task creation & updates
Document changes
Role changes
General workspace activity
👥 Team Management
Invite members via email
View team list
Track join time (e.g. “Joined 2 min ago”)
Role-based permissions:
Owner → Full control (delete workspace, manage everything)
Admin → Manage workspace except deletion & member removal
Member → Read-only access
🔄 Real-Time Collaboration
Socket.io integration
Live updates for:
Task changes
Member activity
Workspace updates
🧑‍💻 Tech Stack
Frontend
React 19
Vite
Tailwind CSS
React Router DOM
Axios
Socket.io Client
React Icons
Backend
Node.js
Express.js
MongoDB (Mongoose)
Socket.io
JWT Authentication
bcryptjs
Redis (ioredis)
express-validator
dotenv
📁 Project Structure
NexaCollab/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── package.json
│
└── README.md
⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/vaibhavi-development-project/NexaCollab.git
cd NexaCollab
2️⃣ Backend Setup
cd backend
npm install

Create .env file:

MONGODB_URI=your_mongo_url
JWT_SECRET=your_secret
PORT=5000
REDIS_URL=your_redis_url

Run backend:

npm run dev
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev
🔐 Authentication Flow
JWT-based login system
Secure cookie handling
Protected routes for workspace access
Role-based permissions enforced on backend
📊 Future Improvements
📎 File upload system in documents
🔔 Notification system
📱 Mobile responsive PWA
🤖 AI task suggestions (using @google/genai)
📈 Analytics dashboard for productivity
🤝 Contribution

Contributions are welcome:

1. Fork the repo
2. Create a new branch
3. Make changes
4. Submit a pull request
📜 License

This project is licensed under the MIT License.

⭐ Show Your Support

If you like this project, consider giving it a ⭐ on GitHub!