import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalBills: 0,
        totalRevenue: 0,
        pendingBills: 0,
    });

    const [recentBills, setRecentBills] = useState([]);

    // ✅ Fetch Dashboard Data
    const fetchDashboard = async () => {
        try {
            // Fetch Patients
            const patientsRes = await api.get("/patients");

            // Fetch Bills
            const billsRes = await api.get("/bill");

            const bills = billsRes.data;

            // Total Revenue
            const revenue = bills.reduce(
                (sum, b) => sum + Number(b.amount),
                0
            );

            // Pending Bills Count
            const pending = bills.filter(
                (b) => b.paymentStatus === "Pending"
            ).length;

            // Recent Bills (Last 5)
            setRecentBills(bills.slice(0, 5));

            // Update Stats
            setStats({
                totalPatients: patientsRes.data.length,
                totalBills: bills.length,
                totalRevenue: revenue,
                pendingBills: pending,
            });
        } catch (error) {
            console.log("Dashboard Error:", error);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    return (
        <Layout>
            <div className="container-fluid">

                {/* Page Title */}
                <h2 className="fw-bold text-primary mb-4">
                    📊 Clinic Dashboard
                </h2>

                {/* Stats Cards */}
                <div className="row g-4 mb-4">

                    {/* Total Patients */}
                    <div className="col-md-3">
                        <div className="card shadow border-0 text-center p-3">
                            <h5 className="text-muted">Total Patients</h5>
                            <h2 className="fw-bold text-primary">
                                {stats.totalPatients}
                            </h2>
                        </div>
                    </div>

                    {/* Total Bills */}
                    <div className="col-md-3">
                        <div className="card shadow border-0 text-center p-3">
                            <h5 className="text-muted">Total Bills</h5>
                            <h2 className="fw-bold text-success">
                                {stats.totalBills}
                            </h2>
                        </div>
                    </div>

                    {/* Total Revenue */}
                    <div className="col-md-3">
                        <div className="card shadow border-0 text-center p-3">
                            <h5 className="text-muted">Total Revenue</h5>
                            <h2 className="fw-bold text-dark">
                                ₹ {stats.totalRevenue}
                            </h2>
                        </div>
                    </div>

                    {/* Pending Payments */}
                    <div className="col-md-3">
                        <div className="card shadow border-0 text-center p-3">
                            <h5 className="text-muted">Pending Bills</h5>
                            <h2 className="fw-bold text-danger">
                                {stats.pendingBills}
                            </h2>
                        </div>
                    </div>

                </div>

                {/* Recent Billing Table */}
                <div className="card shadow-lg border-0">
                    <div className="card-header bg-dark text-white fw-bold">
                        🧾 Recent Billing Records
                    </div>

                    <div className="card-body table-responsive">
                        <table className="table table-bordered table-hover text-center align-middle">
                            <thead className="table-secondary">
                                <tr>
                                    <th>#</th>
                                    <th>Patient</th>
                                    <th>Service</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentBills.length > 0 ? (
                                    recentBills.map((bill, index) => (
                                        <tr key={bill._id}>
                                            <td>{index + 1}</td>
                                            <td>{bill.patientName}</td>
                                            <td>{bill.service}</td>
                                            <td className="fw-bold">₹ {bill.amount}</td>

                                            <td>
                                                <span
                                                    className={`badge ${bill.paymentStatus === "Paid"
                                                        ? "bg-success"
                                                        : "bg-warning text-dark"
                                                        }`}
                                                >
                                                    {bill.paymentStatus}
                                                </span>
                                            </td>

                                            <td>
                                                {bill.date
                                                    ? new Date(bill.date).toLocaleDateString()
                                                    : "N/A"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-muted">
                                            No recent billing records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default Dashboard;
