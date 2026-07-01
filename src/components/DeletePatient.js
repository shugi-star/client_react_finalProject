import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaUserInjured } from "react-icons/fa";
import "./DeletePatient.css";

export default function DeletePatient() {
    const [patients, setPatients] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // טעינת מטופלים
    useEffect(() => {
        fetchPatients();
    }, []);

    //שליפת כל המטפלים
    async function fetchPatients() {
        try {
            const res = await fetch("http://localhost:3001/patients/AllPatients", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (!res.ok) {
                setMessage(data.error || "שגיאה בטעינת מטופלים");
                setMessageType("error");
                setPatients([]);
                return;
            }
            setPatients(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error(err);
            setMessage("שגיאה בטעינת מטופלים");
            setMessageType("error");
        }
    }

    // מחיקה
    async function handleDelete(patientId) {
        try {
            const res = await fetch(`http://localhost:3001/patients/${patientId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "שגיאה במחיקה");
                setMessageType("error");
                return;
            }

            setMessage("המטופל נמחק בהצלחה");
            setMessageType("success");

            // רענון רשימה
            fetchPatients();

        } catch (err) {
            console.error(err);
            setMessage("שגיאת שרת");
            setMessageType("error");
        }
    }

    return (
        <div className="delete-page">
            <div className="delete-card">

                <h2 className="delete-title">
                    <FaUserInjured /> מחיקת מטופלים
                </h2>

                {patients.length === 0 ? (
                    <p>אין מטופלים להצגה</p>
                ) : (
                    <ul className="patient-list">
                        {patients.map((p) => (
                            <li key={p.patient_id} className="patient-item">
                                <div>
                                    <strong>{p.full_name}</strong>
                                    <p>{p.id_number}</p>
                                </div>

                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(p.patient_id)}
                                >
                                    <FaTrash /> מחיקה
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {message && (
                    <p className={`msg ${messageType}`}>{message}</p>
                )}

                <button
                    className="back-btn"
                    onClick={() => navigate("/HeadNurse")}
                >
                    חזרה
                </button>

            </div>
        </div>
    );
}