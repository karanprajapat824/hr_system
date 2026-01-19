import { useEffect, useState } from "react";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaBuilding,
} from "react-icons/fa";
import Input from "../components/ui/Input";
import "./css/Profile.css";
import Sidebar from "../components/Sidebar";
import { getInitials, formatDate } from "../lib/utils";
import { useToast } from "../context/ToastContext";
import Loader from "../components/ui/Loader";
import api from "../lib/api";
import { useAuth } from "../context/authContext";

export default function Profile() {
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();
    const { loading,loggedIn } = useAuth();
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [userProfile, setUserProfile] = useState({
        name: "",
        email: "",
        department: "",
        phone: "",
        role: "EMPLOYEE"
    });

    const fetchUserProfile = async () => {
        try {
            setLoadingProfile(true);
            const res = await api.get("/user/profile");
            setUserProfile(res.data.user);
        } catch (err) {
            showToast({
                type: "error",
                message: err?.response?.data?.message || "Something went wrong"
            });
        } finally {
            setLoadingProfile(false);
        }
    }

    useEffect(() => {
        if (loading) return;
        if(!loggedIn) window.location.href = "/";
        fetchUserProfile();
    }, [loading]);

    if (loading || loadingProfile) return (
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
            <div className="profile-container">
                <div className="profile-header">
                    <h1 className="profile-title">Profile</h1>
                    <p className="profile-subtitle">
                        Manage your personal information
                    </p>
                </div>

                <div className="profile-card">
                    <div className="profile-avatoe-part">
                        <div className="profile-avatar">
                            {getInitials(userProfile.name)}
                        </div>
                        <div className="profile-date-of-joining">Date of Joining : {formatDate(userProfile?.dateOfJoining)}</div>
                        <div className="profile-date-of-joining">Role : {userProfile.role}</div>
                    </div>
                    <div className="profile-info">
                        <h2>{userProfile.name}</h2>
                        <p>{userProfile.email}</p>
                        <span>{userProfile.department}</span>
                    </div>
                </div>


                <div className="profile-form-card">
                    <h3 className="profile-section-title">
                        Personal Information
                    </h3>

                    <div className="profile-form">
                        <div className="profile-field">
                            <label>Email</label>
                            <Input
                                type="email"
                                value={userProfile.email}
                                disabled
                                icon={<FaEnvelope />}
                            />
                            <small>Email cannot be changed</small>
                        </div>

                        <div className="profile-field">
                            <label>Full Name</label>
                            <Input
                                type="text"
                                value={userProfile.name}
                                onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                                icon={<FaUser />}
                                required
                            />
                        </div>

                        <div className="profile-field">
                            <label>Department</label>
                            <Input
                                type="text"
                                value={userProfile.department}
                                onChange={(e) => setUserProfile(prev => ({ ...prev, department: e.target.value }))}
                                icon={<FaBuilding />}
                            />
                        </div>

                        <div className="profile-field">
                            <label>Phone</label>
                            <Input
                                type="tel"
                                value={userProfile.phone}
                                onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))} icon={<FaPhone />}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
