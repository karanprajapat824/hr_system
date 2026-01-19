import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useAuth } from "./../context/authContext";
import api from "./../lib/api";
import {
    FaBuilding,
    FaEnvelope,
    FaLock,
    FaUser,
    FaSpinner,
    FaPhone
} from "react-icons/fa";
import Button from "./../components/ui/Button";
import Input from "./../components/ui/Input";
import "./css/Auth.css";


export default function Auth() {
    const { setUser } = useAuth();
    const { showToast } = useToast();
    const inputRefs = useRef([]);
    const [activeTab, setActiveTab] = useState("signin");
    const [loading, setLoading] = useState(false);

    const [userInput, setUserInput] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        department: "",
        phone: ''
    });

    const focusNext = (index) => {
        inputRefs.current[index + 1]?.focus();
    };

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, [activeTab]);

    const validateFields = () => {
        const { name, email, password, confirmPassword, department, phone } = userInput;

        if (!email.trim()) {
            showToast({ type: "error", message: "Email is required" });
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            showToast({ type: "error", message: "Invalid email address" });
            return false;
        }

        if (!password) {
            showToast({ type: "error", message: "Password is required" });
            return false;
        }
        if (password.length < 6) {
            showToast({
                type: "error",
                message: "Password must be at least 6 characters long",
            });
            return false;
        }

        if (activeTab === "signup") {
            if (!name.trim()) {
                showToast({ type: "error", message: "Name is required" });
                return false;
            }
            if (name.trim().length < 2) {
                showToast({
                    type: "error",
                    message: "Name must be at least 2 characters",
                });
                return false;
            }
            if (!confirmPassword) {
                showToast({
                    type: "error",
                    message: "Please confirm your password",
                });
                return false;
            }
            if (password !== confirmPassword) {
                showToast({
                    type: "error",
                    message: "Password and confirm password do not match",
                });
                return false;
            }
            if (!department.trim()) {
                showToast({
                    type: "error",
                    message: "Department is required"
                });
                return false;
            }
            if (!phone.trim()) {
                showToast({
                    type: "error",
                    message: "Phone is required"
                });
                return false;
            }
        }

        return true;
    };


    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setUserInput(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleAuth = async () => {
        if (!validateFields()) return;
        try {
            setLoading(true);
            const res = await api.post(`/auth/${activeTab}`, userInput);
            showToast({
                type: "success",
                message: "Loggin success",
                duration: 3000,
            });
            if (res?.data?.user?.role === "admin") window.location.href = "/admin"
            else window.location.href = "/";
        } catch (err) {
            showToast({
                type: "error",
                message: err?.response?.data?.message || "Invalid credentials",
            });
            console.log("Error in signin : " + err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="logo">
                        <FaBuilding />
                    </div>
                    <h1>HR Portal</h1>
                    <p>Employee Leave & Attendance</p>
                </div>

                <div className="tabs">
                    <Button
                        variant={activeTab === "signin" ? "primary" : "outline"}
                        onClick={() => setActiveTab("signin")}
                    >
                        Sign In
                    </Button>
                    <Button
                        variant={activeTab === "signup" ? "primary" : "outline"}
                        onClick={() => setActiveTab("signup")}
                    >
                        Sign Up
                    </Button>
                </div>

                {activeTab === "signin" && (
                    <div className="form">
                        <Input
                            type="email"
                            placeholder="you@company.com"
                            value={userInput.email}
                            name="email"
                            onChange={handleOnChange}
                            icon={<FaEnvelope />}
                            ref={(el) => { inputRefs.current[0] = el }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    focusNext(0);
                                }
                            }}
                        />
                        <Input
                            type="password"
                            icon={<FaLock />}
                            placeholder="Password"
                            name="password"
                            value={userInput.password}
                            isPassword={true}
                            onChange={handleOnChange}
                            ref={(el) => { inputRefs.current[1] = el }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && activeTab === "signin") {
                                    e.preventDefault();
                                    handleAuth();
                                }
                            }}
                        />
                        <Button
                            variant={"secondary"}
                            disabled={loading}
                            onClick={handleAuth}
                            loading={loading}
                        >
                            Sign In
                        </Button>
                    </div>
                )}

                {activeTab === "signup" && (
                    <div className="form">
                        <Input
                            type="text"
                            icon={<FaUser />}
                            name="name"
                            placeholder="Full name"
                            value={userInput.name}
                            onChange={handleOnChange}
                            ref={(el) => { inputRefs.current[0] = el }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    focusNext(0);
                                }
                            }}
                        />

                        <Input
                            icon={<FaEnvelope />}
                            type="email"
                            name="email"
                            placeholder="you@company.com"
                            value={userInput.email}
                            onChange={handleOnChange}
                            ref={(el) => { inputRefs.current[1] = el }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    focusNext(1);
                                }
                            }}
                        />

                        <Input
                            icon={<FaLock />}
                            type="password"
                            name="password"
                            isPassword={true}
                            placeholder="Password"
                            value={userInput.password}
                            onChange={handleOnChange}
                            ref={(el) => { inputRefs.current[2] = el }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    focusNext(2);
                                }
                            }}
                        />

                        <Input
                            icon={<FaLock />}
                            type="password"
                            name="confirmPassword"
                            isPassword={true}
                            placeholder="Confirm password"
                            value={userInput.confirmPassword}
                            onChange={handleOnChange}
                            ref={(el) => { inputRefs.current[3] = el }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    focusNext(3);
                                }
                            }}
                        />

                        <Input
                            type="text"
                            name="department"
                            placeholder="Your Department name"
                            value={userInput.department}
                            onChange={handleOnChange}
                            icon={<FaBuilding />}
                            ref={(el) => { inputRefs.current[4] = el }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    focusNext(4);
                                }
                            }}
                        />

                        <Input
                            type="text"
                            name="phone"
                            placeholder="Enter your phone number"
                            value={userInput.phone}
                            onChange={handleOnChange}
                            icon={<FaPhone />}
                            ref={(el) => { inputRefs.current[5] = el }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && activeTab === "signup") {
                                    e.preventDefault();
                                    handleAuth();
                                }
                            }}
                        />

                        <Button
                            onClick={handleAuth}
                            variant={"secondary"}
                            disabled={loading}
                            ref={(el) => { inputRefs.current[6] = el }}
                        >
                            {loading ? <FaSpinner className="spin" /> : "Create Account"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
