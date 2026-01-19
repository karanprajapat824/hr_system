import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaUmbrellaBeach,
    FaBriefcaseMedical,
    FaMoneyBillWave,
    FaSpinner,
} from "react-icons/fa";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import "./css/LeaveApply.css";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/authContext";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import api from "../lib/api";
import { useToast } from "../context/ToastContext";

export default function LeaveApply() {
    const navigate = useNavigate();
    const { loading } = useAuth();
    const { showToast } = useToast();
    const [leaveBalance, setLeaveBalance] = useState({
        casual: 0,
        sick: 0,
        paid: 0
    });
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [selectLeaveType, setSelectLeaveType] = useState(-1);
    const [selectType, setSelectType] = useState(false);

    const leaveTypes = [
        {
            key: "casual",
            label: "Casual Leave",
            icon: <FaUmbrellaBeach />,
            balance: leaveBalance.casual,
        },
        {
            key: "sick",
            label: "Sick Leave",
            icon: <FaBriefcaseMedical />,
            balance: leaveBalance.sick,
        },
        {
            key: "paid",
            label: "Paid Leave",
            icon: <FaMoneyBillWave />,
            balance: leaveBalance.paid,
        },
    ];

    const getLeaveDays = () => {
        let leaveDay = 0;
        if (selectLeaveType === 0) leaveDay = leaveBalance.casual;
        if (selectLeaveType === 1) leaveDay = leaveBalance.sick;
        if (selectLeaveType === 2) leaveDay = leaveBalance.paid;
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
        if (days <= 0) return "Invalid Date Range"
        else if (days > leaveDay) return `${leaveTypes[selectLeaveType].label}s are not enough`;
        else return days;
    };

    const handleApplyLeave = async () => {
        try {
            setSubmitting(true);
            const res = await api.post("/user/apply-leave", {
                leaveType: leaveTypes[selectLeaveType].key,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                reason: reason
            });
            navigate("/leave/history");
        } catch (err) {
            showToast({
                type: "error",
                message: err?.response.data.message || "Something went wrong"
            });
        } finally {
            setSubmitting(false);
        }
    }

    const fetchRemainingLeave = async () => {
        try {
            const res = await api.get("/user/remaining-leave");
            setLeaveBalance(res.data.leaveBalance);
        } catch (err) {
            console.log("error " + err);
        }
    }

    useEffect(() => {
        fetchRemainingLeave();
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
            <div className="leave-apply-container">
                <div className="leave-apply-header">
                    <h1>Apply for Leave</h1>
                    <p>Submit a new leave request</p>
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

                <div className="leave-apply-form" >
                    <div>
                        <h3>Leave Details</h3>
                        <p>Fill in the details for your leave request</p>
                    </div>
                    <div className="leave-apply-field">
                        <label className="leave-apply-label">Leave Type</label>
                        <div onClick={() => setSelectType(!selectType)} className="leave-apply-select-type">
                            <div>{selectLeaveType === -1 ? "Select leave type" : leaveTypes[selectLeaveType].label}</div>
                            {
                                selectType ? <IoIosArrowUp /> : <IoIosArrowDown />
                            }
                        </div>
                        {
                            selectType && <div className="leave-apply-types">
                                {
                                    leaveTypes.map((type, index) => (
                                        <div key={type.key}
                                            className={`leave-apply-type ${selectLeaveType === index ? "active" : ""
                                                }`}
                                            onClick={() => { setSelectLeaveType(index); setSelectType(false) }} >
                                            {type.icon}
                                            <span>{type.label}</span>
                                            <span>({type.balance} days)</span>
                                        </div>
                                    ))
                                }
                            </div>
                        }

                    </div>
                    <div className="leave-apply-row">
                        <div>
                            <label>Start Date</label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>End Date</label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {startDate && endDate && (
                        <div className="leave-apply-days">
                            <h3>Total leave days : </h3>
                            <div>{getLeaveDays()}</div>
                        </div>
                    )}

                    <div className="leave-apply-field">
                        <label>Reason (optional)</label>
                        <textarea
                            className="leave-apply-textarea"
                            rows="4"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Reason for leave..."
                        />
                    </div>

                    <div className="leave-apply-actions">
                        <Button type="button" variant="outline" onClick={() => navigate("/")}>
                            Cancel
                        </Button>
                        <Button
                            variant="secondary"
                            disabled={submitting}
                            loading={submitting}
                            onClick={handleApplyLeave}
                        >
                            Submit Request
                        </Button>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
