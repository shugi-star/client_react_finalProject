import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserNurse, FaIdCard, FaLock, FaUserPlus } from "react-icons/fa";
import "./New_Nurse.css";

export default function New_nurse() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [isHeadNurse, setIsHeadNurse] = useState(false);
    const token = localStorage.getItem("token");

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("הסיסמאות לא תואמות");
            setMessageType("error");
            return;
        }

        const newNurse = {
            fullName,
            password,
            id: idNumber,
            head_Nurse: isHeadNurse
        };
        //שליחה לשרת עם כל הנתונים
        const response = await fetch("http://localhost:3001/nurse/new_nurse", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(newNurse),
        });
        const data = await response.json();
        if (!response.ok) {
            setMessage(data.error || data.message);
            setMessageType("error");
            console.log("נכנס לפהה")
            return;
        }
        console.log("אחות נוצרה תודה להשם")
        setMessage("אחות נוצרה בהצלחה");
        setMessageType("success");
    
        console.log("נוצרה אחות:", data);
    }

    return (
        <div className="new-nurse-page">
            <div className="new-nurse-card">
                <div className="new-nurse-header">
                    <div className="new-nurse-icon">
                        <FaUserPlus />
                    </div>
                    <div>
                        <h1 className="new-nurse-title">הוספת אחות חדשה</h1>
                        <p className="new-nurse-subtitle">יצירת משתמש אחות במערכת</p>
                    </div>
                </div>

                <form className="new-nurse-form" onSubmit={handleSubmit}>
                    <div className="new-nurse-field">
                        <label htmlFor="nurseFullName">
                            <FaUserNurse /> שם אחות
                        </label>
                        <input
                            id="nurseFullName"
                            type="text"
                            placeholder="הזיני שם מלא"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className="new-nurse-field">
                        <label htmlFor="nurseIdNumber">
                            <FaIdCard /> תעודת זהות
                        </label>
                        <input
                            id="nurseIdNumber"
                            type="text"
                            placeholder="הזיני מספר זהות"
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                        />
                    </div>

                    <div className="new-nurse-field">
                        <label htmlFor="nursePassword">
                            <FaLock /> סיסמה
                        </label>
                        <input
                            id="nursePassword"
                            type="password"
                            placeholder="הזיני סיסמה"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="new-nurse-field">
                        <label htmlFor="nurseConfirmPassword">
                            <FaLock /> אימות סיסמה
                        </label>
                        <input
                            id="nurseConfirmPassword"
                            type="password"
                            placeholder="הזיני שוב את הסיסמה"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="new-nurse-field">
                        <label>האם אחות ראשית?</label>

                        <div style={{ display: "flex", gap: "20px", marginTop: "8px" }}>

                            <label>
                                <input
                                    type="radio"
                                    name="headNurse"
                                    checked={isHeadNurse === 1}
                                    onChange={() => setIsHeadNurse(1)}
                                />
                                כן
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="headNurse"            
                                    checked={isHeadNurse === 0}
                                    onChange={() => setIsHeadNurse(0)}
                                />
                                לא
                            </label>

                        </div>
                    </div>
                    <button type="submit" className="new-nurse-submit" >
                        יצירת אחות
                    </button>

                    <button
                        type="button"
                        className="new-nurse-back"
                        onClick={() => navigate("/HeadNurse")}
                    >
                        חזרה
                    </button>
                </form>

                {message && (
                    <p className={`new-nurse-message ${messageType}`}>{message}</p>
                )}
            </div>
        </div>
    );
}
