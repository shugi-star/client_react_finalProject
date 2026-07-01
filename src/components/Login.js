import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaUserNurse, FaIdCard, FaLock } from "react-icons/fa";
import "./Login.css";

export default function Login() {
    const [nurseId, setNurseId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [message, setMessage] = useState("");


    async function login() {
        try {
            const response = await fetch("http://localhost:3001/nurse/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nurseId,
                    password,
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                console.error("Login failed:", result.message);
                setMessage(result.error || result.message);
                return;
            }
            setMessage(result.error || result.message);
            if (!result.token) {
                console.error("no token");
                return;
            }
            localStorage.setItem("token", result.token);

            const token = localStorage.getItem("token");

            const decoded = jwtDecode(token);

            console.log("decoded:", decoded)
            console.log("isHeadNuese:", decoded.isHeadNuese)

            if (decoded.isHeadNurse==1) {
                navigate("/HeadNurse");
            } else {
                navigate("/Nurse");
            }
        } catch (error) {
            console.error("error login:", error);
            alert("שגיאה! סיסמא או שם משתמש שגוי...");
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">
                        <FaUserNurse />
                    </div>
                    <div className="login-header-text">
                        <h1 className="login-title">מערכת ניהול מחלקה</h1>
                        <p className="login-subtitle">כניסה לאחיות</p>
                    </div>
                </div>

                <div className="login-field">
                    <label htmlFor="nurseId">
                        <FaIdCard /> תעודת זהות
                    </label>
                    <input
                        id="nurseId"
                        type="text"
                        placeholder="הזיני מספר אחות"
                        value={nurseId}
                        onChange={(e) => setNurseId(e.target.value)}
                    />
                </div>

                <div className="login-field">
                    <label htmlFor="password">
                        <FaLock /> סיסמה
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="הזיני סיסמה"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="button" className="login-btn" onClick={login}>
                    כניסה
                </button>

            </div>
        </div>
    );
}
