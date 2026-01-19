import "./css/DashBoard.css";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Button from "./../components/ui/Button";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import api from "./../lib/api";
import { useNavigate } from "react-router-dom";
import {
    FaPlus,
    FaArrowRight,
    FaTimes
} from "react-icons/fa";
import {
    FcClock,
    FcCalendar,
} from "react-icons/fc";
import {
    FaUmbrellaBeach,
    FaBriefcaseMedical,
    FaMoneyBillWave,
    FaSpinner,
} from "react-icons/fa";
import Loader from "../components/ui/Loader";
import { formatDate, formatTime, formatDateShort } from "../lib/utils";

export default function DashBoard() {
    const navigateTo = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [leaveBalance, setLeaveBalance] = useState({
        casual: 0,
        sick: 0,
        paid: 0
    });
    const [check, setCheck] = useState(false);
    const [recentLeaves, setRecentLeaves] = useState([]);
    const [todayAttendance, setTodayAttendance] = useState({
        status: "pending",
        checkin: "---",
        checkout: "---"
    });
    const [loading, setLoading] = useState(true);

    const handleCheckIn = async () => {
        try {
            setCheck(true);
            const res = await api.get("/user/checkin");
            setTodayAttendance(res.data.attendance);
        } catch (err) {
            console.log(err);
            showToast({
                type: "error",
                message: err?.response.data.message || "Something went wrong"
            });
        } finally {
            setCheck(false);
        }
    }

    const handleCheckout = async () => {
        try {
            setCheck(true);
            const res = await api.get("/user/checkout");
            setTodayAttendance(res.data.attendance);
        } catch (err) {
            console.log(err);
            showToast({
                type: "error",
                message: err?.response.data.message || "Something went wrong"
            });
        } finally {
            setCheck(false);
        }
    }

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const res = await api.get("/user/user-info");
            setLeaveBalance(res.data.leaveBalance);
            setTodayAttendance(res.data.attendance);
            setRecentLeaves(res.data.leaves);
        } catch (err) {
            console.log("error " + err);
        } finally {
            setLoading(false);
        }
    }

    const getIcon = (type) => {
        switch (type) {
            case "CASUAL":
                return <FaUmbrellaBeach className="casual" />;
            case "SICK":
                return <FaBriefcaseMedical className="sick" />;
            case "PAID":
                return <FaMoneyBillWave className="paid" />;
            default:
                return null;
        }
    };

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
            <div className="dashboard-container">

                <div className="dashboard-header">
                    <h1 className="dashboard-title">Welcome back!</h1>
                    <p className="dashboard-subtitle">
                        Here's your leave and attendance overview
                    </p>
                </div>


                <div className="dashboard-actions">
                    <Button
                        onClick={() => navigateTo("/leave/apply")}
                        size="sm"
                        variant={"secondary"}
                    >
                        <FaPlus />
                        Apply for Leave
                    </Button>

                    {
                        (todayAttendance?.status === "pending" ||
                            todayAttendance?.status === "ABSENT" ||
                            !todayAttendance?.status) &&
                        (
                            <Button
                                size="md"
                                variant="outline"
                                loading={check}
                                disabled={check}
                                onClick={handleCheckIn}>
                                <FcClock />
                                Check In
                            </Button>
                        )
                    }
                    {
                        (todayAttendance?.status === "PRESENT" &&
                            !todayAttendance?.checkout) &&
                        (
                            <Button variant="outline"
                                loading={check}
                                disabled={check}
                                onClick={handleCheckout}
                            >
                                <FcClock />
                                Check Out
                            </Button>
                        )
                    }
                    {
                        todayAttendance?.status === "PRESENT" &&
                        todayAttendance?.checkin &&
                        todayAttendance?.checkout &&
                        <Button variant="outline" disabled>
                            <FcCalendar />
                            Today Complete
                        </Button>
                    }
                </div>

                <div className="dashboard-stats">
                    <div className="dashboard-card">
                        <div className="dashboard-card-content">
                            <div>
                                <p className="dashboard-card-label">Casual Leaves</p>
                                <p className="dashboard-card-value">
                                    {leaveBalance?.casual || 0}
                                </p>
                                <p className="dashboard-card-meta">Days remaining</p>
                            </div>
                            <div className="dashboard-icon dashboard-icon-sky">
                                <FaUmbrellaBeach />
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div className="dashboard-card-content">
                            <div>
                                <p className="dashboard-card-label">Sick Leaves</p>
                                <p className="dashboard-card-value">
                                    {leaveBalance?.sick || 0}
                                </p>
                                <p className="dashboard-card-meta">Days remaining</p>
                            </div>
                            <div className="dashboard-icon dashboard-icon-red">
                                <FaBriefcaseMedical />
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div className="dashboard-card-content">
                            <div>
                                <p className="dashboard-card-label">Paid Leaves</p>
                                <p className="dashboard-card-value">
                                    {leaveBalance?.paid || 0}
                                </p>
                                <p className="dashboard-card-meta">Days remaining</p>
                            </div>
                            <div className="dashboard-icon dashboard-icon-green">
                                <FaMoneyBillWave />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card-content">
                        <div className="dashboard-date">
                            <h2 className="dashboard-section-title">Today Attendance</h2>
                            <div>Date : {formatDate(Date.now())}</div>
                            <div className="dashboard-today-attendence">
                                <div className="checkIn">
                                    <div>Check In</div>
                                    <div>{formatTime(todayAttendance?.checkin) || "---"}</div>
                                </div>
                                <div className="checkout">
                                    <div>Check out</div>
                                    <div>{formatTime(todayAttendance?.checkout) || "---"}</div>
                                </div>
                            </div>
                        </div>
                        <div className="dashboard-icon dashboard-icon-green">
                            <FcCalendar />
                        </div>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h2 className="dashboard-section-title">Recent Leave Requests</h2>
                        <Link to="/leave/history" className="dashboard-view-all">
                            View all <FaArrowRight />
                        </Link>
                    </div>

                    {recentLeaves.length === 0 ? (
                        <div className="dashboard-empty">
                            <FcCalendar />
                            <p>No leave requests yet</p>
                            <Link to="/leave/apply">Apply for your first leave</Link>
                        </div>
                    ) : (
                        <table className="leave-history-table">
                            <tbody>
                                {recentLeaves.map((leave) => (
                                    <tr key={leave._id}>
                                        <td>
                                            <div className="leave-history-type">
                                                {getIcon(leave.leaveType)}
                                                <span>{leave.leaveType}</span>
                                            </div>
                                        </td>
                                        <td>
                                            {formatDateShort(leave.startDate)} → {formatDateShort(leave.endDate)}
                                        </td>
                                        <td>
                                            <span
                                                className={`leave-history-badge ${leave.status.toLowerCase()}`}
                                            >
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td>{formatDateShort(leave.appliedAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Sidebar>
    )
}