# Patient Monitoring System

## Overview

A full-stack patient monitoring system designed to help hospital nurses view patients' monitor data in real time through a centralized interface.

The goal of the system is to make patient monitoring information accessible to nurses through a user-friendly interface, helping them view patient-related information and receive real-time monitoring updates.

The system consists of three interconnected components:

- **Frontend:** A React application that provides the user interface for viewing patient information and monitoring data.
- **Main Backend:** A Node.js and Express server that provides API endpoints for patient, nurse, and bed-related data.
- **Monitoring Server:** A separate Node.js service that uses WebSockets to support real-time monitoring updates.

Together, these components demonstrate a multi-service architecture that combines frontend development, REST API integration, and real-time communication.

## System Architecture

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

## Technologies

- React
- JavaScript
- Node.js
- Express.js
- REST APIs
- WebSockets
- npm

## Frontend — This Repository

This repository contains the client-side application built with React.

The frontend provides the interface through which nurses can interact with the system and view patient-related information and monitoring data supplied by the backend services.

### Responsibilities

- Rendering the user interface.
- Displaying patient-related information.
- Communicating with backend API endpoints.
- Connecting to monitoring services where configured.
- Presenting monitoring updates received from the backend.

## Running Locally

### Prerequisites

- Node.js and npm installed.
- The project repositories cloned to your computer.

### 1. Install Dependencies

Open a terminal in the `client_react_finalProject` directory and run:

```bash
npm install
```

### 2. Start the Frontend

Run:

```bash
npm start
```

The development server will typically be available at:

```text
http://localhost:3000
```

### 3. Start the Backend Services

To use features that depend on server data, start the main backend and the monitoring server as described in their respective README files.

**Note:** The frontend alone does not provide the complete system functionality. The backend services must be running, and their connection URLs must match the local development configuration.

## Future Improvements

- Add screenshots of the user interface.
- Improve automated test coverage.
- Document frontend components and data flows.
- Centralize service URLs in environment configuration.

## Project Context

This project demonstrates full-stack development and real-time communication in a patient monitoring application concept designed for hospital nursing workflows.
