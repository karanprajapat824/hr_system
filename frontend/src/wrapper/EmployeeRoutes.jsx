import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Loader from "./../components/ui/Loader";

export default function EmployeeRoutes() {
    const { user, loading, loggedIn } = useAuth();
    if (loading) return <div style={{
        display: "flex",
        justifyContent: 'center',
        alignItems: "center",
        height : "100vh"
    }}>
        <Loader />
    </div>;
    if(user.role === "ADMIN") return <Navigate to={"/admin"} replace/>
    return (user.role === "EMPLOYEE" && loggedIn) ? <Outlet /> : <Navigate to={"/auth"} replace />
}