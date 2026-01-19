import { useState, useEffect } from "react";
import {
  FaUsers,
  FaFileAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Button from "./../../components/ui/Button";
import "./css/AdminDashboard.css";
import Sidebar from "../../components/Sidebar";
import api from "../../lib/api";
import Loader from "../../components/ui/Loader";
import { formatDateShort } from "./../../lib/utils";
import { useToast } from "./../../context/ToastContext";

export default function AdminDashBoard() {
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingRequests: 0,
    presentToday: 0,
    pendingLeaves: []
  });
  const [loading, setLoading] = useState(true);


  const handleLeaveStatus = async (status, id, userId) => {
    try {
      console.log(status, id);
      const res = await api.get(`/admin/leaveStatus?status=${status}&id=${id}&userId=${userId}`);
      fetchDashboardData();
    } catch (err) {
      showToast({
        type: "error",
        message: err?.response?.data.message || "Something went wrong"
      });
    } finally {
      setLoading(false);
    }
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/dashboard");
      setStats({
        totalEmployees: res.data.totalEmployees,
        pendingRequests: res.data.pendingRequests,
        presentToday: res.data.presentToday,
        pendingLeaves: res.data.pendingLeaves
      });
      console.log(res.data.pendingLeaves);
    } catch (err) {
      console.log("error " + err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return (
    <Sidebar>
      <div style={{
        display: "flex",
        justifyContent: 'center',
        alignItems: "center",
        height: "80vh"
      }}>
        <Loader />
      </div>
    </Sidebar>
  )

  return (
    <Sidebar>
      <div className="admin-dashboard-container">
        {/* Header */}
        <div className="admin-dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Overview of HR operations</p>
        </div>

        {/* Stats */}
        <div className="admin-dashboard-stats">
          <div className="admin-dashboard-stat">
            <div>
              <p>Total Employees</p>
              <h2>{stats.totalEmployees}</h2>
            </div>
            <FaUsers />
          </div>

          <div className="admin-dashboard-stat">
            <div>
              <p>Pending Requests</p>
              <h2>{stats.pendingRequests}</h2>
            </div>
            <FaFileAlt />
          </div>

          <div className="admin-dashboard-stat">
            <div>
              <p>Present Today</p>
              <h2>{stats.presentToday}</h2>
            </div>
            <FaClock />
          </div>
        </div>

        {/* Pending Leaves */}
        <div className="admin-dashboard-card">
          <h2>Pending Leave Requests</h2>

          {stats.pendingLeaves.length === 0 ? (
            <p className="admin-dashboard-empty">
              No pending requests
            </p>
          ) : (
            <div className="admin-dashboard-list">
              {stats?.pendingLeaves.map((l) => (
                <div
                  key={l._id}
                  className="admin-dashboard-leave"
                >
                  <div>
                    <strong>{l.employeeId.name}</strong>
                    <p className="admin-dashboard-meta">
                      {l.leaveType} • {formatDateShort(l.startDate)} -{" "}
                      {formatDateShort(l.endDate)}
                    </p>
                  </div>

                  <div className="admin-dashboard-actions">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLeaveStatus("APPROVED", l._id, l.employeeId._id)}
                    >
                      <FaCheckCircle /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleLeaveStatus("REJECTED", l._id, l.employeeId._id)
                      }
                    >
                      <FaTimesCircle /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Sidebar >
  );
}
