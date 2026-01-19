import { useEffect, useState } from "react";
import {
    FaUmbrellaBeach,
    FaBriefcaseMedical,
    FaMoneyBillWave,
    FaTimes,
} from "react-icons/fa";
import Button from "../components/ui/Button";
import "./css/LeaveHistory.css";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { useToast } from "../context/ToastContext";
import Loader from "./../components/ui/Loader";
import { formatDateShort } from "../lib/utils";


export default function LeaveHistory() {
    const [leaves, setLeaves] = useState([]);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [showModal, setShowModal] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);

    const filteredLeaves =
        statusFilter === "ALL"
            ? leaves
            : leaves.filter((l) => l.status === statusFilter);

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

    const cancelLeave = async () => {
        try {
            const res = await api.post("/user/cancel-leave", {
                id : selectedLeave._id
            });
            setLeaves((prev) =>
                prev.map((l) =>
                    l._id === selectedLeave._id
                        ? { ...l, status: "CANCELLED" }
                        : l
                )
            );
        } catch (err) {
            showToast({
                type: "error",
                message: err?.response.data.message || "Something went wrong"
            })
        } finally {
            setShowModal(false);
            setSelectedLeave(null);
        }

    };

    const fetchLeaveHistory = async () => {
        try {
            setLoading(true);
            const res = await api.get("/user/leave-history");
            setLeaves(res.data.leaves);
        } catch (err) {
            showToast({
                type: "error",
                message: err?.response.data.message || "Something went wrong"
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLeaveHistory();
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
            <div className="leave-history-container">

                <div className="leave-history-header">
                    <div>
                        <h1>Leave History</h1>
                        <p>View and manage your leave requests</p>
                    </div>

                    <select
                        className="leave-history-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>

                <div className="leave-history-card">
                    {filteredLeaves.length === 0 ? (
                        <p className="leave-history-empty">
                            No leave requests found
                            <Link to="/leave/apply">Apply for your first leave</Link>
                        </p>
                    ) : (
                        <table className="leave-history-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                    <th>Applied On</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeaves.map((leave) => (
                                    <tr key={leave.id}>
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
                                        <td>
                                            {leave.status === "PENDING" && (
                                                <button
                                                    className="leave-history-cancel"
                                                    onClick={() => {
                                                        setSelectedLeave(leave);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <FaTimes /> Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="leave-history-modal">
                        <div className="leave-history-modal-box">
                            <h3>Cancel Leave Request</h3>
                            <p>
                                Are you sure you want to cancel this leave
                                request?
                            </p>
                            <div className="leave-history-modal-actions">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                >
                                    Keep
                                </Button>
                                <Button onClick={()=>cancelLeave()}>
                                    Cancel Request
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Sidebar>
    );
}
