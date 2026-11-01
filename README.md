# Patient Monitoring System — Frontend

## Overview

The Frontend is the user-facing component of a full-stack patient monitoring system designed to support hospital nursing workflows.

Built with React, the application provides a centralized interface through which nurses can access patient-related information and view monitoring data supplied by the backend services.

This repository focuses on the client-side application and its integration with the system's REST API and real-time monitoring service.

It is part of a larger project composed of three interconnected repositories.

## System Architecture

The complete system consists of three independent but interconnected components:

- **Frontend:** A React application providing the user interface.
- **Main Backend:** A Node.js and Express server providing REST API endpoints.
- **Monitoring Server:** A separate Node.js service supporting real-time communication through WebSockets.

### Architecture Diagram

```text
                  Hospital Nurses
                         |
                         v
                   React Frontend
                    /          \
                   v            v
              REST API       WebSocket
                   |            |
                   v            v
             Main Backend   Monitoring Server
             Node.js/Express  Node.js/Express
                   |
                   v
           Patient-related data
```

## Related Repositories

This project is divided into three repositories:

| Component | Repository | Technology |
|---|---|---|
| Frontend | [client_react_finalProject](https://github.com/shugi-star/client_react_finalProject) | React |
| Main Backend | [server_react_finalProject](https://github.com/shugi-star/server_react_finalProject) | Node.js, Express |
| Monitoring Server | [monitor_demo_react](https://github.com/shugi-star/monitor_demo_react) | Node.js, Express, WebSockets |

## Technologies

- React
- JavaScript
- React Router
- React Icons
- REST APIs
- WebSockets
- npm

## Responsibilities

- Rendering the user interface.
- Displaying patient-related information.
- Communicating with backend API endpoints.
- Connecting to the monitoring service through WebSockets.
- Presenting monitoring updates received from the backend services.

## Running the Complete System Locally

The frontend is one of three services in the Patient Monitoring System. To use the complete application functionality, all three repositories must be available and running.

### Prerequisites

- Node.js and npm installed.
- Git installed.

### 1. Clone the Repositories

```bash
git clone https://github.com/shugi-star/server_react_finalProject.git
git clone https://github.com/shugi-star/monitor_demo_react.git
git clone https://github.com/shugi-star/client_react_finalProject.git
```

### 2. Start the Main Backend

In the `server_react_finalProject` directory:

```bash
npm install
npm start
```

The Main Backend uses port `3001` by default:

```text
http://localhost:3001
```

### 3. Start the Monitoring Server

In a separate terminal, open the `monitor_demo_react` directory:

```bash
npm install
node server.js
```

The Monitoring Server uses port `3002` by default.

### 4. Start the Frontend

Open another terminal in the `client_react_finalProject` directory:

```bash
npm install
npm start
```

The React development server is typically available at:

```text
http://localhost:3000
```

### Local Services Overview

| Service | Default Port | Local Address |
|---|---:|---|
| Frontend | 3000 | `http://localhost:3000` |
| Main Backend | 3001 | `http://localhost:3001` |
| Monitoring Server | 3002 | `ws://localhost:3002/ws/monitorsRealtime` |

### Integration Configuration

The frontend communicates with the Main Backend to retrieve patient-related information and connects to the Monitoring Server for real-time updates.

For complete local operation, verify that the frontend API and WebSocket connection settings match the endpoints configured in the backend services.

## Project Context

The Frontend is part of the **Patient Monitoring System**, a multi-service application demonstrating React development, frontend-backend integration, and real-time data communication.
