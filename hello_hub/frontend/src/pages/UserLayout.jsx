import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import Topbar from "../components/Topbar";

export default function UserLayout() {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar-container">
        <UserNavbar />
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
