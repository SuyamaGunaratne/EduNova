import React from "react";
import { Outlet } from "react-router-dom";
import TechnicianNavbar from "../components/TechnicianNavbar";
import Topbar from "../components/Topbar";

export default function TechnicianLayout() {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar-container">
        <TechnicianNavbar />
      </div>
      <main className="dashboard-main-content">
        <Topbar />
        <div className="dashboard-content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}