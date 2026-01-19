import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import "./css/Employees.css";
import Sidebar from "../../components/Sidebar";
import api from "../../lib/api";
import { useToast } from "../../context/ToastContext";

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const { showToast } = useToast();

    const fetchEmployeedata = async () => {
        try {
            const res = await api.get("/admin/employees");
            setEmployees(res.data.users);
        } catch (err) {
            showToast({
                type: "error",
                message: err?.response.data.message || "Something went wrong"
            });
        }
    }

    useEffect(() => {
        fetchEmployeedata();
    }, []);

    return (
        <Sidebar>
            <div className="admin-employees-container">
                {/* Header */}
                <div className="admin-employees-header">
                    <h1>Employees</h1>
                    <p>Manage all employees</p>
                </div>

                {/* Table */}
                <div className="admin-employees-card">
                    <table className="admin-employees-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Department</th>
                                <th>Casual </th>
                                <th>Sick</th>
                                <th>Paid</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((e) => (
                                <tr key={e._id}>
                                    <td>
                                        <div className="admin-employees-user">
                                            <div className="admin-employees-avatar">
                                                <FaUserCircle />
                                            </div>
                                            <div>
                                                <strong>{e.name}</strong>
                                                <p>{e.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{e.department || "-"}</td>
                                    <td>{e.leaveBalance.casual}</td>
                                    <td>{e.leaveBalance.sick}</td>
                                    <td>{e.leaveBalance.paid}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Sidebar>
    );
}
