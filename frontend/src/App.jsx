import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AdminRoutes from "./wrapper/AdminRoutes";
import EmployeeRoutes from "./wrapper/EmployeeRoutes";
import DashBoard from "./pages/DashBoard"
import Profile from "./pages/Profile";
import LeaveApply from "./pages/LeaveApply";
import LeaveHistory from "./pages/LeaveHistory";
import Attendance from "./pages/Attendance";
import Employees from "./pages/admin/Employees";
import Auth from "./pages/Auth";
import { ToastProvider } from "./context/ToastContext";
import AdminDashboard from "./pages/admin/AdminDashBoard";
import AdminAttendance from "./pages/admin/AdminAttendance";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />}/>
          
          <Route element={<EmployeeRoutes />}>
            <Route path="/" element={<DashBoard />} />
            <Route path="/leave/apply" element={<LeaveApply />}/>
            <Route path="/leave/history" element={<LeaveHistory />}/>
            <Route path="attendance" element={<Attendance />}/>
          </Route>
          

          <Route element={<AdminRoutes />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/employees" element={<Employees />}/>
            <Route path="/admin/attendance" element={<AdminAttendance />}/>
          </Route>

        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
