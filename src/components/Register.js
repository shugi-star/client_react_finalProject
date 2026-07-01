import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserNurse, FaIdCard, FaLock, FaUserPlus } from "react-icons/fa";
import "./Register.css";

export default function Register() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("הסיסמאות לא תואמות");
            setMessageType("error");
            return;
        }

        setMessage("ההרשמה נשלחה בהצלחה");
        setMessageType("success");
    }

    return (
        <div className="register-page">
            <div className="register-card">
                <div className="register-header">
                    <div className="register-icon">
                        <FaUserPlus />
                    </div>
                    <div>
                        <h1 className="register-title">הרשמה למערכת</h1>
                        <p className="register-subtitle">יצירת חשבון אחות חדשה</p>
                    </div>
                </div>

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="register-field">
                        <label htmlFor="fullName">
                            <FaUserNurse /> שם מלא
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            placeholder="הזיני שם מלא"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className="register-field">
                        <label htmlFor="idNumber">
                            <FaIdCard /> תעודת זהות
                        </label>
                        <input
                            id="idNumber"
                            type="text"
                            placeholder="הזיני מספר זהות"
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                        />
                    </div>

                    <div className="register-field">
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

                    <div className="register-field">
                        <label htmlFor="confirmPassword">
                            <FaLock /> אימות סיסמה
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="הזיני שוב את הסיסמה"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="register-submit">
                        הרשמה
                    </button>

                    <button
                        type="button"
                        className="register-back"
                        onClick={() => navigate("/")}
                    >
                        חזרה לכניסה
                    </button>
                </form>

                {message && (
                    <p className={`register-message ${messageType}`}>{message}</p>
                )}
            </div>
        </div>
    );
}
