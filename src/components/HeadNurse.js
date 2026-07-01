import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaHospitalUser } from "react-icons/fa";
import Header from "./Header";
import Beds from "./Beds";
import "./HaedNurse.css";


export default function HeadNurse() {
    const navigate = useNavigate();
    return (
        <div className="head-nurse-page">
            <Header />
            <div className="head-nurse-actions">
                <button type="button" onClick={() => navigate("/new_nurse")}>
                    <FaUserPlus /> הוספת אחות חדשה
                </button>
               
                <button type="button" onClick={() => navigate("/new_patient")}>
                    <FaHospitalUser /> הוספת מטופל חדש
                </button>
                <button type="button" onClick={() => navigate("/DeletePatient")}>
                    <FaHospitalUser /> מחיקת מטופל         
                </button>
                <button type="button" onClick={() => navigate("/AddBed")}>
                    <FaHospitalUser /> הוספת מיטה         
                </button>
            </div>
            <Beds />
        </div>
    );
}
