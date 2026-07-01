import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBed, FaExclamationTriangle, FaUserInjured } from "react-icons/fa";
import "./Beds.css";

const WS_URL = "ws://localhost:3002/ws/monitorsRealtime";

function normalizeAlerts(msg) {
    const raw = msg.alerts ?? msg.data?.alerts;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.filter(Boolean);
    if (typeof raw === "string") return [raw];
    return [];
}

function hasAlerts(alerts) {
    return Array.isArray(alerts) && alerts.length > 0;
}

export default function Beds() {
    const [vitals, setVitals] = useState({});
    const [patients, setPatients] = useState([]);
    const connectionsRef = useRef([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // חיבור WebSocket נפרד לכל מטופל — כמו Bed.js, רק אחד-לאחד.
    // השרת לא שולח patient_id בתוך ההודעה, ולכן חיבור משותף אחד לא מספיק.
    useEffect(() => {
        connectionsRef.current.forEach(({ ws, patientKey }) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "unsubscribe", patientId: patientKey }));
            }
            ws.close();
        });
        connectionsRef.current = [];

        if (patients.length === 0) return;

        const connections = patients.map((p) => {
            const patientKey = Number(p.patient_id);
            const ws = new WebSocket(WS_URL);

            ws.onopen = () => {
                ws.send(JSON.stringify({
                    type: "subscribe",
                    patientId: patientKey,
                }));
            };

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.type !== "vitals") return;

                const alerts = normalizeAlerts(msg);

                setVitals((prev) => ({
                    ...prev,
                    [patientKey]: {
                        monitor: msg.data || {},
                        alerts,
                    },
                }));
            };

            return { ws, patientKey };
        });

        connectionsRef.current = connections;

        return () => {
            connections.forEach(({ ws, patientKey }) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: "unsubscribe", patientId: patientKey }));
                }
                ws.close();
            });
            connectionsRef.current = [];
        };
    }, [patients]);

    useEffect(() => {
        fetchPatients();
    }, []);

    async function fetchPatients() {
        try {
            const response = await fetch("http://localhost:3001/beds/GetPaientsToNurse", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("שגיאה מהשרת:", response.status, errorData);
                return;
            }

            const data = await response.json();
            if (data.length) {
                setPatients(data);
            }
        } catch (err) {
            console.error("error loading patients", err);
        }
    }

    function openPatient(patientId) {
        navigate(`/bed/${patientId}`);
    }

    return (
        <div className="beds-page">
            <header className="beds-header">
                <div className="beds-header-icon">
                    <FaBed />
                </div>
                <div className="beds-header-text">
                    <h2>המיטות שבאחריותי</h2>
                    <p>{patients.length} מטופלים תחת אחריותך</p>
                </div>
            </header>

            {patients.length === 0 ? (
                <div className="beds-empty">
                    <FaBed />
                    <p>אין מטופלים משויכים כרגע</p>
                </div>
            ) : (
                <div className="beds-grid">
                    {patients.map((p) => {
                        const patientKey = Number(p.patient_id);
                        const state = vitals[patientKey];
                        const alerts = state?.alerts || [];
                        const monitor = state?.monitor;
                        const danger = hasAlerts(alerts);

                        return (
                            <button
                                key={patientKey}
                                type="button"
                                onClick={() => openPatient(patientKey)}
                                className={`bed-card${danger ? " bed-card--danger" : ""}`}
                                aria-label={`מיטה ${p.bed_id}, ${p.full_name}${danger ? ", יש חריגה" : ""}`}
                            >
                                <div className="bed-card-top">
                                    <span className="bed-number">
                                        <FaBed />
                                        מיטה {p.bed_id}
                                    </span>

                                    <span className={`bed-status${danger ? " bed-status--alert" : monitor ? " bed-status--ok" : ""}`}>
                                        {danger ? (
                                            <>
                                                <FaExclamationTriangle />
                                                חריגה
                                            </>
                                        ) : monitor ? (
                                            "יציב"
                                        ) : (
                                            "ממתין..."
                                        )}
                                    </span>
                                </div>

                                <div className="bed-patient-name">
                                    <FaUserInjured />
                                    {p.full_name}
                                </div>

                                {danger && (
                                    <div className="bed-alert-list">
                                        {alerts.map((alert, index) => (
                                            <span key={`${patientKey}-alert-${index}`} className="bed-alert-tag">
                                                {typeof alert === "string" ? alert : alert.message || alert.field || "חריגה"}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
