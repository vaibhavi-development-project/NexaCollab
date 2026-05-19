import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Dashboard from '../pages/Dashboard'
import Register from '../pages/Register'
import AppLayout from '../components/AppLayout'
import Task from "../pages/Task"
import Team from "../pages/Team"
import Documents from "../pages/Documents"
import Activity from "../pages/Activity"
import WorkspaceLayout from '../components/WorkspaceLayout'
import { WorkspaceProvider } from '../context/WorkspaceContext'
import Profile from "../pages/Profile"
import ViewDoc from "../pages/ViewDoc"
import CreateDocument from "../pages/CreateDocument"
import ViewTask from "../pages/ViewTask"

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<Home />}></Route>
      <Route path="/register" element={<Register />}></Route>

      <Route element={<AppLayout />}>
      <Route path="/profile" element={<Profile />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/workspaces/:workspaceId/documents/:docId" element={<ViewDoc />}></Route>
        <Route path="/workspaces/:workspaceId/documents/createDocument" element={<CreateDocument/>}></Route>
        <Route path="/workspaces/:workspaceId/:taskId/Viewtask" element={<ViewTask/>}></Route>

        <Route path="/workspaces/:workspaceId"
          element={<WorkspaceProvider>
            <WorkspaceLayout />
          </WorkspaceProvider>}
        >
          <Route index element={<Task />} />
          <Route path="task" element={<Task />}></Route>
          <Route path="documents" element={<Documents />}></Route>
          <Route path="activity" element={<Activity />}></Route>
          <Route path="team" element={<Team />}></Route>


        </Route>

      </Route>

    </Routes>
  )
}

export default AppRoutes