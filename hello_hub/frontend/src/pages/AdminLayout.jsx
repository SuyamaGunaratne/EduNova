import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Topbar from "../components/Topbar";

export default function AdminLayout() {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar-container">
        <AdminNavbar />
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