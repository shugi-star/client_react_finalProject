import { useNavigate } from "react-router-dom";

export default function LogOut() {

    const navigate = useNavigate();

    function logOut() {
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <button type="button" className="logout-btn" onClick={logOut}>
            יציאה
        </button>
    );
}