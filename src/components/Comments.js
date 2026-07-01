import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaCommentMedical, FaEdit, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import "./Comments.css";

const API_BASE = "http://localhost:3001/patients";

export default function Comments() {
    const { patientId } = useParams();
    const token = localStorage.getItem("token");

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newComment, setNewComment] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!patientId) {
            setComments([]);
            setLoading(false);
            return;
        }

        loadComments();
    }, [patientId]);

    async function loadComments() {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_BASE}/${patientId}/getComments`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                let errorMessage = "שגיאה בטעינת הערות";
                try {
                    const errorData = await response.json();
                    errorMessage =
                        errorData.error ||
                        errorData.message ||
                        errorMessage;
                } catch {
                    // ignore invalid JSON in error response
                }
                setError(errorMessage);
                setComments([]);
                return;
            }

            const data = await response.json();
            const list = Array.isArray(data)
                ? data
                : Array.isArray(data?.comments)
                    ? data.comments
                    : data && typeof data === "object" && (data.comment_id ?? data.id)
                        ? [data]
                        : [];
            setComments(list);
        } catch (err) {
            console.error("error loading comments", err);
            setError("לא ניתן לטעון הערות");
            setComments([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddComment(e) {
        e.preventDefault();

        const text = newComment.trim();
        if (!text) return;

        setSaving(true);
        setError("");

        try {
            const response = await fetch(`${API_BASE}/AddComment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    patient_id: Number(patientId),
                    comment_text: text,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || data.message || "שגיאה בהוספת הערה");
                return;
            }

            setNewComment("");
            await loadComments();
        } catch (err) {
            console.error("error adding comment", err);
            setError("לא ניתן להוסיף הערה");
        } finally {
            setSaving(false);
        }
    }

    function startEdit(comment) {
        setEditingId(getCommentId(comment));
        setEditText(getCommentText(comment));
    }

    function cancelEdit() {
        setEditingId(null);
        setEditText("");
    }

    async function handleUpdateComment(commentId) {
        const text = editText.trim();
        if (!text) return;

        setSaving(true);
        setError("");

        try {
            const response = await fetch(`${API_BASE}/UpdateComment/${commentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    comment_text: text,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || data.message || "שגיאה בעדכון הערה");
                return;
            }

            cancelEdit();
            await loadComments();
        } catch (err) {
            console.error("error updating comment", err);
            setError("לא ניתן לעדכן הערה");
        } finally {
            setSaving(false);
        }
    }

    function getCommentId(comment) {
        return comment.comment_id ?? comment.id;
    }

    function getCommentText(comment) {
        return comment.comment_text || comment.text || comment.content || comment.body || "";
    }

    function formatDate(value) {
        if (!value) return "";
        return new Date(value).toLocaleString("he-IL");
    }

    if (!patientId) {
        return (
            <div className="comments-section">
                <div className="comments-empty">לא נבחר מטופל</div>
            </div>
        );
    }

    return (
        <div className="comments-section">
            <div className="comments-header">
                <div className="comments-header-icon">
                    <FaCommentMedical />
                </div>
                <div>
                    <h2>הערות על המטופל</h2>
                    <p>{comments.length} הערות</p>
                </div>
            </div>

            <form className="comments-add-form" onSubmit={handleAddComment}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="כתבי הערה חדשה על המטופל..."
                    rows={3}
                    disabled={saving}
                />
                <button
                    type="submit"
                    className="comments-add-btn"
                    disabled={saving || !newComment.trim()}
                >
                    <FaPlus /> הוספת הערה
                </button>
            </form>

            {error && <p className="comments-error">{error}</p>}

            {loading ? (
                <div className="comments-loading">טוען הערות...</div>
            ) : comments.length === 0 ? (
                <div className="comments-empty">אין הערות עדיין למטופל זה</div>
            ) : (
                <ul className="comments-list">
                    {comments.map((comment) => {
                        const commentId = getCommentId(comment);
                        const isEditing = editingId === commentId;

                        return (
                            <li key={commentId} className="comments-item">
                                <div className="comments-item-meta">
                                    <strong>{comment.nurse_name || comment.full_name || "אחות"}</strong>
                                    <span>{formatDate(comment.created_at || comment.updated_at)}</span>
                                </div>

                                {isEditing ? (
                                    <div className="comments-edit-form">
                                        <textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            rows={3}
                                            disabled={saving}
                                        />
                                        <div className="comments-edit-actions">
                                            <button
                                                type="button"
                                                className="comments-save-btn"
                                                onClick={() => handleUpdateComment(commentId)}
                                                disabled={saving || !editText.trim()}
                                            >
                                                <FaSave /> שמירה
                                            </button>
                                            <button
                                                type="button"
                                                className="comments-cancel-btn"
                                                onClick={cancelEdit}
                                                disabled={saving}
                                            >
                                                <FaTimes /> ביטול
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="comments-item-text">{getCommentText(comment)}</p>
                                        <button
                                            type="button"
                                            className="comments-edit-btn"
                                            onClick={() => startEdit(comment)}
                                            disabled={saving}
                                        >
                                            <FaEdit /> עריכה
                                        </button>
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
