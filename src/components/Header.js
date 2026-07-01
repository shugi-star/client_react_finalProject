import { jwtDecode } from "jwt-decode";
import { FaCrown, FaUserNurse } from "react-icons/fa";
import LogOut from "./LogOut";
import "./Header.css";

export default function Header() {
    const token = localStorage.getItem("token");
    let nurse = null;

    if (token) {
        nurse = jwtDecode(token);
    }

    return (
        <header className="header">
            <div className="user-area">
                <span className="user-area-title">
                    {nurse?.isHeadNurse ? <FaCrown className="user-icon crown" /> : <FaUserNurse className="user-icon" />}
                    אזור אישי
                </span>

                {nurse ? (
                    <>
                        <span className="user-detail">
                            <b>שם:</b> {nurse.fullName || "לא נמצא"}
                        </span>
                        <span className="user-divider">|</span>
                        <span className="user-detail">
                            <b>מספר אחות:</b> {nurse.nurseNumber}
                        </span>
                        <span className="user-divider">|</span>
                        <span className="user-role">
                            {nurse.isHeadNurse ? "אחות ראשית" : "אחות רגילה"}
                        </span>
                    </>
                ) : (
                    <span className="user-detail">לא מחוברת</span>
                )}
            </div>

            <LogOut />
        </header>
    );
}
