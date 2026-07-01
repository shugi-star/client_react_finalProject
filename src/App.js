import * as React from 'react';
import { Routes, Route } from "react-router-dom";
import { SocketProvider } from "./components/SocketContext";
import './App.css';
import Login from './components/Login';
import HeadNurse from './components/HeadNurse';
import Beds from './components/Beds';
import Bed from './components/Bed';
import New_nurse from './components/New_nurse';
import New_patient from './components/New_patient';
import Nurse from './components/Nurse';
import LogOut from './components/LogOut';
import Header from './components/Header';
// import DeletePatient from './components/DeletePatient';
import AddBed from './components/AddBed';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <SocketProvider>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />

        <Route path="/Beds" element={<Beds />} />
        <Route path="/bed/:patientId" element={<Bed />} />

        <Route
          path="/HeadNurse"
          element={
            <ProtectedRoute requireHeadNurse={true}>
              <HeadNurse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new_nurse"
          element={
            <ProtectedRoute requireHeadNurse={true}>
              <New_nurse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/new_patient"
          element={
            <ProtectedRoute requireHeadNurse={true}>
              <New_patient />
            </ProtectedRoute>
          }
        />

        <Route path="/Header" element={<Header />} />
        <Route path="/LogOut" element={<LogOut />} />

        <Route
          path="/Nurse"
          element={
              <Nurse />
          }
        />

        <Route
          path="/AddBed"
          element={
            <ProtectedRoute requireHeadNurse={true}>
              <AddBed />
            </ProtectedRoute>
          }
        />

      </Routes>
    </SocketProvider>
  );
}

export default App;
