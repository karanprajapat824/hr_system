import "./css/Sidebar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FcDepartment, FcDatabase, FcLeave, FcClock, FcCalendar, FcInspection } from "react-icons/fc";
import { IoMdClose, IoIosLogOut } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import Button from "./ui/Button";
import api from "../lib/api";
import { useToast } from "../context/ToastContext";

const employeeNavItems = [
    { href: '/', label: 'Dashboard', icon: MdDashboard },
    { href: '/leave/apply', label: 'Apply Leave', icon: FcCalendar },
    { href: '/leave/history', label: 'Leave History', icon: FcInspection },
    { href: '/attendance', label: 'Attendance', icon: FcClock },
    { href: '/profile', label: 'Profile', icon: FaUsers },
];

const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: MdDashboard },
    { href: '/admin/employees', label: 'Employees', icon: FaUsers },
    { href: '/admin/attendance', label: 'Attendance', icon: FcClock },
    { href: '/profile', label: 'Profile', icon: FaUsers },
];

export default function Sidebar({ children }) {
    const navigateTo = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const { user, setLoggedIn, RefreshToken } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const getInitials = (email) => email?.slice(0, 2).toUpperCase();
    const navItems = user?.role === 'ADMIN' ? adminNavItems : employeeNavItems;

    const handleSignOut = async () => {
        try {
            const res = await api.get("/auth/signout");
        } catch (err) {
            showToast({
                type: "error",
                message: err?.response.data.message || "Something went wrong"
            });
        } finally {
            window.location.reload();
        }
    }

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-inner">
                    <div className="sidebar-logo">
                        <div className="logo-icon">
                            <FcDepartment />
                        </div>
                        <span>HR Portal</span>
                    </div>

                    <nav className="sidebar-nav">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={`nav-item ${isActive ? "active" : ""}`}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div onClick={() => navigateTo("/profile")} className="sidebar-user">
                        <div className="avatar">{getInitials(user?.email || "U")}</div>
                        <div className="user-info">
                            <p className="email">{user?.email || ""}</p>
                            <p className="role">{user?.role || "Employee"}</p>
                        </div>
                    </div>
                </div>
            </aside>

            <header className="mobile-header">
                <div className="mobile-logo">
                    <FcDepartment />
                    <span>HR Portal</span>
                </div>
                <button
                    className="icon-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <IoMdClose style={{ color: "white" }} /> : <FcDatabase />}
                </button>
            </header>


            {mobileMenuOpen && (
                <div className="mobile-menu">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={`mobile-nav-item ${isActive ? "active" : ""}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}

                    <button className="logout-btn" onClick={handleSignOut}>
                        <IoIosLogOut />
                        Sign Out
                    </button>
                </div>
            )}

            <main className="main">
                <header className="desktop-header">
                    <Button
                        variant={"secondary"}
                        onClick={handleSignOut}>
                        <IoIosLogOut />
                        Sign Out
                    </Button>
                </header>

                <div className="content">
                    {children}
                </div>
            </main>
        </div>
    )
}
