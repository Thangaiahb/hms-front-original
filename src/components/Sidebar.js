import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaUserInjured,
    FaFileInvoiceDollar,
    FaPills,
    FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
    const navigate = useNavigate();

    // Logout Function
    const handleLogout = () => {
        localStorage.removeItem("token");
        alert("✅ Logged out successfully");
        navigate("/");
    };

    return (
        <div
            className="bg-dark text-white p-3"
            style={{
                width: "250px",
                minHeight: "100vh",
                position: "fixed",
            }}
        >
            <h3 className="text-center mb-4 fw-bold">🏥 HMS</h3>

            <ul className="nav flex-column">

                <li className="nav-item mb-3">
                    <Link className="nav-link text-white" to="/dashboard">
                        <FaHome className="me-2" />
                        Dashboard
                    </Link>
                </li>

                <li className="nav-item mb-3">
                    <Link className="nav-link text-white" to="/patients">
                        <FaUserInjured className="me-2" />
                        Patients
                    </Link>
                </li>

                <li className="nav-item mb-3">
                    <Link className="nav-link text-white" to="/billing">
                        <FaFileInvoiceDollar className="me-2" />
                        Billing
                    </Link>
                </li>

                <li className="nav-item mb-3">
                    <Link className="nav-link text-white" to="/prescriptions">
                        <FaPills className="me-2" />
                        Prescriptions
                    </Link>
                </li>

                {/* Logout Button */}
                <li className="nav-item mt-4">
                    <button
                        onClick={handleLogout}
                        className="btn btn-danger w-100"
                    >
                        <FaSignOutAlt className="me-2" />
                        Logout
                    </button>
                </li>

            </ul>
        </div>
    );
};

export default Sidebar;
