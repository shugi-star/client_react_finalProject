import "./404.css";
import notFoundImg from "../assets/not_found.png";

export default function NotFoundImage() {
    return (
        <div className="notfound-fullscreen">
            <img src={notFoundImg} alt="not found" />
        </div>
    );
}