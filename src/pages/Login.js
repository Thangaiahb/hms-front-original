import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // Handle Change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Login Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/login", formData);

            // ✅ Save Correct Token
            localStorage.setItem("token", res.data.access_token);

            alert("Login Success");

            navigate("/dashboard");
        } catch (error) {
            alert("Invalid Login");
        }
    };


    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4" style={{ width: "400px" }}>
                <h3 className="text-center fw-bold mb-4">🏥 HMS Login</h3>

                <form onSubmit={handleSubmit}>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter email"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    {/* Button */}
                    <button type="submit" className="btn btn-primary w-100">
                        🔐 Login
                    </button>

                </form>

                <p className="text-muted text-center mt-3">
                    Small Clinic HMS System
                </p>
            </div>
        </div>
    );
};

export default Login;
