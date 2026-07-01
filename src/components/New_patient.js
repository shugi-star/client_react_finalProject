import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    FaHospitalUser,
    FaIdCard,
    FaCalendarAlt,
    FaNotesMedical,
    FaUserNurse
} from "react-icons/fa";
import "./New_patient.css";

export default function New_patient() {
    const [nurses, setNurses] = useState([]);
    const navigate = useNavigate();
    const date = new Date().toISOString().split("T")[0];
    const [patient, setPatient] = useState({
        full_name: "",
        id_number: "",
        admission_date: date,
        disease_type: "",
        nurse_number: ""
    });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const token = localStorage.getItem("token");
    //טעינת אחיות מהשרת
    useEffect(() => {
        async function fetchNurses() {
            const res = await fetch("http://localhost:3001/nurse/AllNurses", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`},
        
            });
            const data = await res.json();
            console.log("date", data)
            setNurses(Array.isArray(data) ? data : []);
        }
        fetchNurses();
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatient((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("New patient:", patient);
            const res = await fetch("http://localhost:3001/patients/new_patient", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(patient)
            });
            const data = await res.json();
    
            console.log("STATUS:", res.status);
            console.log("DATA:", data);
    
            if (!res.ok) {
                setMessage(data.error || "שגיאה בהוספה");
                setMessageType("error");
                return;
            }
    
            setMessage(data.message);
            setMessageType("success");
    
        } catch (err) {
            console.error("NETWORK ERROR:", err);
            setMessage("שגיאת שרת");
            setMessageType("error");
        }
    };

    return (
        <div className="new-patient-page">
            <div className="new-patient-card">
                <div className="new-patient-header">
                    <div className="new-patient-icon">
                        <FaHospitalUser />
                    </div>
                    <div>
                        <h1 className="new-patient-title">הוספת מטופל חדש</h1>
                        <p className="new-patient-subtitle">רישום מטופל חדש במחלקה</p>
                    </div>
                </div>

                <form className="new-patient-form" onSubmit={handleSubmit}>
                    <div className="new-patient-field">
                        <label htmlFor="full_name">
                            <FaHospitalUser /> שם מלא
                        </label>
                        <input
                            id="full_name"
                            type="text"
                            name="full_name"
                            placeholder="הזיני שם מטופל"
                            value={patient.full_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="new-patient-field">
                        <label htmlFor="id_number">
                            <FaIdCard /> תעודת זהות
                        </label>
                        <input
                            id="id_number"
                            type="text"
                            name="id_number"
                            placeholder="הזיני מספר זהות"
                            value={patient.id_number}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="new-patient-field">
                        <label htmlFor="admission_date">
                            <FaCalendarAlt /> תאריך קבלה
                        </label>
                        <input
                            id="admission_date"
                            type="date"
                            name="admission_date"
                            value={patient.admission_date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="new-patient-field">
                        <label htmlFor="disease_type">
                            <FaNotesMedical /> סוג מחלה / אבחנה
                        </label>
                        <input
                            id="disease_type"
                            type="text"
                            name="disease_type"
                            placeholder="הזיני אבחנה"
                            value={patient.disease_type}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="new-patient-field">
    {/* <label htmlFor="nurse_number">
        <FaUserNurse /> מספר אחות אחראית
    </label>

    <select
    name="nurse_number"
    value={patient.nurse_number}
    onChange={handleChange}
>
    <option value="">בחרי אחות</option>

    {nurses.map((nurse) => (
        <option key={nurse.nurse_number} value={nurse.nurse_number}>
            {nurse.fullName} 
        </option> */}
    {/* ))} */}
{/* </select> */}
</div>

                    <button type="submit" className="new-patient-submit">
                        הוספת מטופל
                    </button>

                    <button
                        type="button"
                        className="new-patient-back"
                        onClick={() => navigate("/HeadNurse")}
                    >
                        חזרה
                    </button>
                </form>

                {message && (
                    <p className={`new-patient-message ${messageType}`}>{message}</p>
                )}
            </div>
        </div>
    );
}
