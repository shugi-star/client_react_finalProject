import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Comments from "./Comments";
import {
    FaArrowRight,
    FaUserInjured,
    FaHeartbeat,
    FaHeart,
    FaTint,
    FaLungs,
    FaIdCard,
    FaBed,
    FaNotesMedical,
    FaClock
} from "react-icons/fa";
import { useSocket } from "./SocketContext";
import "./Bed.css";
import { FaThermometerHalf } from "react-icons/fa";

export default function Bed() {
    const socket = useSocket();
    console.log("socket:", socket)
    const { patientId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [patient, setPatient] = useState(null);
    const [monitor, setMonitor] = useState(null);
    const [alerts, setAlerts] = useState([]);
    useEffect(() => {
        console.log("patientId", patientId)
        loadPatient();
    }, [patientId]);
       //שולח בקשת התחברות לשרת של המוניטור לחולה הספציפי הזה
       useEffect(() => {
        if (!socket) return;
        const subscribe = () => {
            socket.send(
                JSON.stringify({
                    type: "subscribe",
                    patientId: Number(patientId)
                })
            );
            console.log("Subscribed:", patientId);
        };
        if (socket.readyState === WebSocket.OPEN) {
            subscribe();
        } else {
            socket.addEventListener("open", subscribe, { once: true });
        }
        //סגירת ההאזנה של החיבור הזה
        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(
                    JSON.stringify({
                        type: "unsubscribe",
                        patientId: Number(patientId)
                    })
                );
    
                console.log("Unsubscribed:", patientId);
            }
        }
    }, [socket, patientId]);
    //האזנה להודעות בכל שניה
    useEffect(() => {
        if (!socket){
            console.log("לא מחובר");
            return;
        }
        console.log("socket state1:", socket?.readyState);
        console.log("מחובר לפני שמיעת ההודעות");
        console.log("monitor: ", monitor)

        const onMessage = (e) => {
            console.log("קיבלתי:", e.data);
            const msg = JSON.parse(e.data);
            //מקבל את סוג ההודעה
            if (msg.type !== "vitals") return;
            //בודק שמדובר במטופל הנוכחי
            // console.log("fffff",msg.data.patient_id)
            // if (msg.data.patient_id !== Number(patientId)) return;
            console.log("לפני עדכון המוניטור")
            setMonitor(msg.data);
            console.log("socket state2:", socket?.readyState);


            //התראות
            if(msg.alerts?.length>0){
                setAlerts(msg.alerts);
            }else{
                setAlerts([]);
            }
        };
        socket.addEventListener("message", onMessage);
        return () => socket.removeEventListener("message", onMessage);
    }, [socket, patientId]);
 

    async function loadPatient() {
        console.log("נכנס לנתוני מטופל בודד שנבחר")
        try {
            const response = await fetch(`http://localhost:3001/patients/${patientId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();
            console.log("result: ", result)
            if (result) {
                setPatient(result[0]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (!patient) {
        return (
            <div className="bed-page">
                <div className="bed-loading">
                    <div className="bed-loading-spinner" />
                    <p>טוען נתוני מטופל...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bed-page">
            <div className="bed-top-bar">
                <button
                    type="button"
                    className="bed-back-btn"
                    onClick={() => navigate(-1)}
                    aria-label="חזרה למסך המיטות"
                >
                    <FaArrowRight />
                </button>

                <div className="bed-patient-title">
                    <div className="bed-patient-title-icon">
                        <FaUserInjured />
                    </div>
                    <div>
                        <h1>{patient.full_name}</h1>
                        <span>מיטה {patient.bed_id}</span>
                    </div>
                </div>
            </div>

            <div className="bed-details-grid">
                <section className="bed-panel monitor-panel">
                    <div className="bed-panel-header">
                        <div className="bed-panel-header-icon">
                            <FaHeartbeat />
                        </div>
                        <h2>נתוני מוניטור</h2>
                    </div>

                    {monitor ? (
                        <div className="vital-cards">



{/* בדיקת דופק */}
<div className={`vital-card ${
    alerts?.some(a => a?.field === "heart_rate" || a === "דופק גבוה" || a === "דופק נמוך")
        ? "danger blink"
        : ""
}`}>
    <div className="vital-card-icon heart">
        <FaHeart />
    </div>
    <div>
        <div className="vital-card-label">דופק</div>
        <div className="vital-card-value">
            {monitor?.heart_rate} BPM
        </div>
    </div>
</div>

{/* לחץ דם */}
<div className={`vital-card ${
    alerts?.some(a => a?.field === "blood_pressure" || a === "לחץ דם גבוה" || a === "לחץ דם נמוך")
        ? "danger blink"
        : ""
}`}>
    <div className="vital-card-icon bp">
        <FaTint />
    </div>
    <div>
        <div className="vital-card-label">לחץ דם</div>
        <div className="vital-card-value">
            {monitor?.blood_pressure}
        </div>
    </div>
</div>

{/* סטורציה */}
<div className={`vital-card ${
    alerts?.some(a => a?.field === "oxygen_level" || a === "סטורציה נמוכה")
        ? "danger blink"
        : ""
}`}>
    <div className="vital-card-icon oxygen">
        <FaLungs />
    </div>
    <div>
        <div className="vital-card-label">סטורציה</div>
        <div className="vital-card-value">
            {monitor?.oxygen_level}%
        </div>
    </div>
</div>

{/* חום גוף */}
<div className={`vital-card ${
    alerts?.some(a => a?.field === "temperature" || a === "חום גבוה" || a === "חום גוף נמוך")
        ? "danger blink"
        : ""
}`}>
    <div className="vital-card-icon temperature">
        <FaThermometerHalf />
    </div>
    <div>
        <div className="vital-card-label">חום גוף</div>
        <div className="vital-card-value">
            {monitor?.temperature}°C
        </div>
    </div>
</div>

{/* אק״ג */}
<div className={`vital-card ${
    alerts?.some(a => a?.field === "ecg" || a === "חריגה באק״ג")
        ? "danger blink"
        : ""
}`}>
    <div className="vital-card-icon ecg">
        <FaHeartbeat />
    </div>
    <div>
        <div className="vital-card-label">אק״ג</div>
        <div className="vital-card-value">
            {monitor?.ecg === "normal" ? "תקין" : monitor?.ecg}
        </div>
    </div>
</div>

{/* זמן */}
<div className="vital-card">
    <div className="vital-card-icon time">
        <FaClock />
    </div>
    <div>
        <div className="vital-card-label">מדידה אחרונה</div>
        <div className="vital-card-value">
            {monitor?.timestamp
                ? new Date(monitor.timestamp).toLocaleTimeString("he-IL")
                : "—"}
        </div>
    </div>
</div>
                    </div>
                    ) : (
                        <div className="monitor-empty">
                            ממתין לנתונים מהמוניטור...
                        </div>
                    )}
                </section>

                <section className="bed-panel patient-panel">
                    <div className="bed-panel-header">
                        <div className="bed-panel-header-icon">
                            <FaNotesMedical />
                        </div>
                        <h2>פרטי מטופל</h2>
                    </div>

                    <div className="patient-info-list">
                        <div className="patient-info-row">
                            <FaIdCard />
                            <span>תעודת זהות</span>
                            <strong>{patient.patient_id}</strong>
                        </div>
                        <div className="patient-info-row">
                            <FaBed />
                            <span>מיטה</span>
                            <strong>{patient.bed_id}</strong>
                        </div>
                        <div className="patient-info-row">
                            <FaNotesMedical />
                            <span>אבחנה</span>
                            <strong>{patient.disease_type}</strong>
                        </div>
                    </div>
                </section>
            </div>

            <section className="bed-panel comments-panel">
                <Comments />
            </section>
        </div>
    );
}
