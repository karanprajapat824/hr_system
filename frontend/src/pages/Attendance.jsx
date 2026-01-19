import { useEffect, useState } from "react";
import "./css/Attendance.css";
import Sidebar from "../components/Sidebar";
import api from "../lib/api";
import {
    FcClock,
    FcCalendar,
} from "react-icons/fc";
import { formatDate, formatTime } from "../lib/utils";
import Loader from "../components/ui/Loader";
import { useToast } from "../context/ToastContext";

const demoRecords = [
    {
        id: "1",
        date: "2026-01-18",
        check_in: "2026-01-18T09:30:00Z",
        check_out: "2026-01-18T17:45:00Z",
        status: "present",
    },
    {
        id: "2",
        date: "2026-01-17",
        check_in: "2026-01-17T09:40:00Z",
        check_out: "2026-01-17T17:20:00Z",
        status: "present",
    },
];


function getDuration(inTime, outTime) {
    if (!inTime || !outTime) return "--";
    const diff =
        (new Date(outTime) - new Date(inTime)) / 1000 / 60;
    const h = Math.floor(diff / 60);
    const m = Math.floor(diff % 60);
    return `${h}h ${m}m`;
}

export default function Attendance() {
    const [records, setRecords] = useState(demoRecords);
    const [today, setToday] = useState({});
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const res = await api.get("/user/attendance");
            setRecords(res.data.attendance);
            setToday(res.data.attendance[0]);
        } catch (err) {
            showToast({
                type: "error",
                message: err?.response.data.message || "Something went wrong"
            });
        } finally {
            setLoading(false);
        }
    }

    function dayPresent(){
        const totalPresent = records.filter(day=>day.status === "PRESENT");
        return totalPresent.length;
    }

    useEffect(() => {
        fetchAttendance();
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
            <div className="attendance-container">
                {/* Header */}
                <div className="attendance-header">
                    <h1>Attendance</h1>
                    <p>Track your daily attendance</p>
                </div>

                {/* Today Card */}
                <div className="dashboard-card">
                    <div className="dashboard-card-content">
                        <div className="dashboard-date">
                            <h2 className="dashboard-section-title">Today Attendance</h2>
                            <div>Date : {formatDate(Date.now())}</div>
                            <div className="dashboard-today-attendence">
                                <div className="checkIn">
                                    <div>Check In</div>
                                    <div>{formatTime(today?.checkin) || "---"}</div>
                                </div>
                                <div className="checkout">
                                    <div>Check out</div>
                                    <div>{formatTime(today?.checkout) || "---"}</div>
                                </div>
                            </div>
                        </div>
                        <div className="dashboard-icon dashboard-icon-green">
                            <FcCalendar />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="attendance-stats">
                    <div className="attendance-stat">
                        <span>Days Present</span>
                        <strong>{dayPresent()}</strong>
                    </div>
                    <div className="attendance-stat">
                        <span>Total Records</span>
                        <strong>{records.length}</strong>
                    </div>
                </div>

                {/* History Table */}
                <div className="attendance-card">
                    <h2>This Month&apos;s Records</h2>

                    {records.length === 0 ? (
                        <p className="attendance-empty">
                            No attendance records yet
                        </p>
                    ) : (
                        <table className="attendance-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((r) => (
                                    <tr key={r._id}>
                                        <td>{formatDate(r.date)}</td>
                                        <td>{formatTime(r.checkin)}</td>
                                        <td>{formatTime(r.checkout)}</td>
                                        <td>
                                            {getDuration(
                                                r.checkin,
                                                r.checkout
                                            )}
                                        </td>
                                        <td>
                                            <span
                                                className={`attendance-badge ${r.status.toLowerCase()}`}
                                            >
                                                {r.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Sidebar>
    );
}
