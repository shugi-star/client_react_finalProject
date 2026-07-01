import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBed } from "react-icons/fa";
import "./AddBed.css";

export default function AddBed() {
    const [nurseNumber, setNurseNumber] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const token = localStorage.getItem("token");
    const [nurses, setNurses] = useState([]);
    const navigate = useNavigate();

    //טעינת אחיות מהשרת
    useEffect(() => {
        async function fetchNurses() {
            try {
                const res = await fetch("http://localhost:3001/nurse/AllNurses", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setNurses(Array.isArray(data) ? data : []);
    
            } catch (err) {
                console.error("ERROR loading nurses", err);
            }
        }
        fetchNurses();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("NEW BED:", nurseNumber);

            const res = await fetch("http://localhost:3001/beds/addBed", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    nurse_number: nurseNumber
                })
            });

            const data = await res.json();

            console.log("STATUS:", res.status);
            console.log("DATA:", data);

            if (!res.ok) {
                setMessage(data.error || "שגיאה בהוספת מיטה");
                setMessageType("error");
                return;
            }

            setMessage("המיטה נוספה בהצלחה");
            setMessageType("success");
            setNurseNumber("");

        } catch (err) {
            console.error(err);
            setMessage("שגיאת שרת");
            setMessageType("error");
        }
    };

    return (
        <div className="add-bed-page">
            <div className="add-bed-card">

                <h2 className="add-bed-title">
                    <FaBed /> הוספת מיטה חדשה
                </h2>

                <form onSubmit={handleSubmit} className="add-bed-form">

                <div className="field">
    <label>אחות אחראית</label>

    <select
        value={nurseNumber}
        onChange={(e) => setNurseNumber(e.target.value)}
    >
        <option value="">בחרי אחות</option>

        {nurses.map((nurse) => (
            <option
                key={nurse.nurse_number}
                value={nurse.nurse_number}
            >
                {nurse.full_name} ({nurse.nurse_number})
            </option>
        ))}
    </select>
</div>
                    <button type="submit">הוספת מיטה</button>

                </form>

                {message && (
                    <p className={`msg ${messageType}`}>{message}</p>
                )}

                <button onClick={() => navigate("/HeadNurse")}>
                    חזרה
                </button>

            </div>
        </div>
    );
}