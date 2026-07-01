import { createContext, useContext, useEffect, useState } from "react";

const SocketContext = createContext(null);
//חיבור אחד לכל המערכת זמן אמת
export  function SocketProvider({ children }) {

    const [socket, setSocket] = useState(null);

    useEffect(() => {

        const ws = new WebSocket(
            "ws://localhost:3002/ws/monitorsRealtime"
        );

        ws.onopen = () => {
            console.log("WS Connected");
        };

        ws.onclose = (event) => {
            console.log("WS Disconnected", event.reason, event.code);
            
        };
        setSocket(ws);
        return () => {
            ws.close();
        };

    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}