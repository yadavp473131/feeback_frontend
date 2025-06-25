// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { useEffect } from "react";
import EmployeeView from "./EmployeeView";
import ManagerView from "./ManagerView";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
const navigate = useNavigate();
  const role = localStorage.getItem("user_role");

const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (

    <>
      <div className="dashboard-wrapper bg-light py-5 min-vh-100">
        <div className="container">
          {/* Dashboard Header + Profile */}
          <div className="bg-white rounded-4 shadow-sm p-4 mb-5 border border-2 border-primary-subtle">
            <div className="row align-items-center">
              {/* Dashboard Title */}
              <div className="col-md-8 text-center text-md-start mb-4 mb-md-0">
                <h1 className="text-primary fw-bold">
                  <i className="bi bi-speedometer2 me-2"></i>Dashboard
                </h1>
                <p className="text-muted fs-5">Welcome to your personalized dashboard</p>
              </div>

              {/* Profile Card */}
              <div className="col-md-4 d-flex justify-content-md-end justify-content-center">

                <div className="card shadow-sm border-0 rounded-4 bg-light" style={{ width: '100%', maxWidth: '320px' }}>
                  <div className="card-body">
                    <h3 className="mb-4 text-center text-primary border-bottom pb-2">My Profile</h3>
                    <h5 className="card-title text-dark mb-2">
                      <strong>Name: </strong>{localStorage.getItem("name")}
                    </h5>
                    <p className="text-muted mb-1">
                      <strong>Role: </strong>
                      <span className="badge bg-primary">{localStorage.getItem("user_role")}</span>
                    </p>
                    <p className="text-muted mb-0">
                      <strong>Username: </strong>{localStorage.getItem("username")}
                    </p>
                    <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Role-based Views */}
          
           {role === "manager" && <ManagerView />}
          {role === "employee" && <EmployeeView />}
         
        </div>
      </div>

    </>

  );
}
