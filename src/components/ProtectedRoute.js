import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, requireHeadNurse }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" />;
    }
    const user = jwtDecode(token);
    if (user.isHeadNurse !== requireHeadNurse) {
        return <Navigate to="/404" />;
    }
    return children;
}