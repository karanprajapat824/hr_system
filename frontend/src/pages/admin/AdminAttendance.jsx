import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./css/AdminAttendance.css";
import Sidebar from "../../components/Sidebar";
import api from "../../lib/api";
import { useToast } from "../../context/ToastContext";

function formatTime(date) {
    if (!date) return "--";
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function calcDuration(checkIn, checkOut) {
    if (!checkIn || !checkOut) return "--";
    const diff =
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 60000;
    const h = Math.floor(diff / 60);
    const m = Math.floor(diff % 60);
    return `${h}h ${m}m`;
}

export default function AdminAttendance() {
    const [attend, setAttend] = useState([]);
    const { showToast } = useToast();
    const [search, setSearch] = useState("");

    const filtered = attend.filter(
        (r) =>
            r.employee.name.toLowerCase().includes(search.toLowerCase()) ||
            r.employee.email.toLowerCase().includes(search.toLowerCase())
    );

    async function fetchAttenden() {
        try {
            const res = await api.get("/admin/attendance");
            setAttend(res.data.attendance);
            console.log(res.data.attendance);
        } catch (err) {
            showToast({
                type: "error",
                message: err?.response.data.message || "Something went wrong"
            });
        }
    }
    useEffect(() => {
        fetchAttenden();
    }, []);

    return (
        <Sidebar>
            <div className="admin-attendance-container">
                {/* Header */}
                <div className="admin-attendance-header">
                    <div>
                        <h1>Attendance Records</h1>
                        <p>Monitor employee attendance</p>
                    </div>

                    <div className="admin-attendance-search">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search employee..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="admin-attendance-card">
                    <table className="admin-attendance-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Date</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Duration</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="admin-attendance-empty">
                                        No records found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((r) => (
                                    <tr key={r._id}>
                                        <td>
                                            <strong>{r.employee?.name}</strong>
                                            <p>{r.employee?.email}</p>
                                        </td>
                                        <td>{formatDate(r.date)}</td>
                                        <td>{formatTime(r.checkin)}</td>
                                        <td>{formatTime(r.checkout)}</td>
                                        <td>{calcDuration(r.checkin, r.checkout)}</td>
                                        <td>
                                            <span
                                                className={`admin-attendance-badge ${r.status === "PRESENT" ? "present" : "absent"
                                                    }`}
                                            >
                                                {r.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Sidebar>
    );
}
