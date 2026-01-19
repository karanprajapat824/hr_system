import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function AdminRoutes() {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user.role === "ADMIN" ? <Outlet /> : <Navigate to={"/auth"} replace />
}