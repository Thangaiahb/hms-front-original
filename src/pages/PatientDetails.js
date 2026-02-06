import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";

const PatientDetails = () => {
    const { phone } = useParams();
    const [bills, setBills] = useState([]);

    useEffect(() => {
        api.get(`/bill/${phone}`).then((res) => setBills(res.data));
    }, [phone]);

    return (
        <Layout>
            <h2 className="fw-bold text-primary mb-3">
                🧾 Billing History
            </h2>

            <table className="table table-bordered text-center">
                <thead className="table-dark">
                    <tr>
                        <th>Date</th>
                        <th>Service</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {bills.length > 0 ? (
                        bills.map((b, i) => (
                            <tr key={i}>
                                <td>{new Date(b.date).toLocaleDateString()}</td>
                                <td>{b.service}</td>
                                <td>₹ {b.amount}</td>
                                <td>{b.paymentStatus}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No bills found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Layout>
    );
};

export default PatientDetails;
