import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");


    // ✅ Popup States
    const [showModal, setShowModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [billingHistory, setBillingHistory] = useState([]);

    // ✅ Quick Bill Form inside popup
    const [newBill, setNewBill] = useState({
        service: "",
        amount: "",
        paymentStatus: "Paid",
    });

    // =====================================================
    // ✅ Fetch Patients
    // =====================================================
    const fetchPatients = async () => {
        try {
            const res = await api.get("/patients");
            setPatients(res.data);

        } catch (error) {
            console.log("Error fetching patients:", error);

        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    // =====================================================
    // ✅ Search Filter
    // =====================================================
    const filteredPatients = patients.filter((p) => {
        const nameMatch = p.name
            ?.toLowerCase()
            .includes(search.toLowerCase());

        const phoneMatch = String(p.phone || "").includes(search);

        return nameMatch || phoneMatch;
    });

    // =====================================================
    // ✅ Open Popup + Load Billing History
    // =====================================================
    const openBillingPopup = async (patient) => {
        setSelectedPatient(patient);
        setShowModal(true);

        try {
            const res = await api.get(`/bill/${patient.phone}`);
            setBillingHistory(res.data);
        } catch (error) {
            console.log("Error fetching billing history:", error);
        }
    };

    // =====================================================
    // ✅ Close Popup
    // =====================================================
    const closePopup = () => {
        setShowModal(false);
        setSelectedPatient(null);
        setBillingHistory([]);
        setNewBill({ service: "", amount: "", paymentStatus: "Paid" });
    };

    // =====================================================
    // ✅ Calculate Total Amount Paid
    // =====================================================
    const totalAmount = billingHistory.reduce(
        (sum, bill) => sum + Number(bill.amount),
        0
    );

    // =====================================================
    // ✅ Print Patient Billing Report
    // =====================================================
    const printPatientReport = () => {
        const printWindow = window.open("", "", "width=900,height=700");

        printWindow.document.write(`
      <html>
      <head>
        <title>Patient Billing Report</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid black; padding: 10px; text-align: center; }
        </style>
      </head>
      <body>
        <h2>🏥 Patient Billing Report</h2>
        <p><b>Patient:</b> ${selectedPatient.name}</p>
        <p><b>Phone:</b> ${selectedPatient.phone}</p>
        <p><b>Total Bills:</b> ${billingHistory.length}</p>
        <p><b>Total Amount Paid:</b> ₹${totalAmount}</p>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Prescription</th>

            </tr>
          </thead>
          <tbody>
            ${billingHistory
                .map(
                    (b) => `
              <tr>
                <td>${new Date(b.date).toLocaleDateString()}</td>
                <td>${b.service}</td>
                <td>₹${b.amount}</td>
                <td>${b.paymentStatus}</td>
              </tr>
            `
                )
                .join("")}
                <th>Prescription</th>

          </tbody>
        </table>

        <br/>
        <p><b>Doctor Signature:</b> _____________________</p>

        <script>
          window.print();
        </script>
      </body>
      </html>
    `);

        printWindow.document.close();
    };

    // =====================================================
    // ✅ Add New Bill Directly from Popup
    // =====================================================
    const addQuickBill = async (e) => {
        e.preventDefault();

        try {
            await api.post("/bill", {
                patientName: selectedPatient.name,
                phone: selectedPatient.phone,
                age: selectedPatient.age,
                ...newBill,
            });

            alert("✅ New Bill Added Successfully");

            // Refresh Billing History
            const res = await api.get(`/bill/${selectedPatient.phone}`);
            setBillingHistory(res.data);

            // Reset Form
            setNewBill({ service: "", amount: "", paymentStatus: "Paid" });
        } catch (error) {
            console.log("Error adding quick bill:", error);
            alert("❌ Failed to Add Bill");
        }
    };

    return (
        <Layout>
            <div className="container-fluid">

                <h2 className="fw-bold text-primary mb-4">
                    👨‍⚕️ Patients Management
                </h2>

                {/* Search */}
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="🔍 Search patient..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Patients Table */}
                <div className="card shadow-lg">
                    <div className="card-header bg-dark text-white fw-bold">
                        📋 Patients List
                    </div>

                    <div className="card-body table-responsive">
                        <table className="table table-bordered text-center">
                            <thead className="table-secondary">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Phone</th>
                                    <th>Billing</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredPatients.map((p, index) => (
                                    <tr key={p._id}>
                                        <td>{index + 1}</td>
                                        <td>{p.name}</td>
                                        <td>{p.age}</td>
                                        <td>{p.phone}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => openBillingPopup(p)}
                                            >
                                                🧾 View Bills
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>

                {/* =====================================================
            ✅ ADVANCED BILLING POPUP
        ===================================================== */}
                {showModal && (
                    <div
                        className="modal fade show"
                        style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
                    >
                        <div className="modal-dialog modal-xl">
                            <div className="modal-content">

                                {/* Header */}
                                <div className="modal-header bg-primary text-white">
                                    <h5>
                                        🧾 Billing Details - {selectedPatient.name}
                                    </h5>
                                    <button
                                        className="btn-close btn-close-white"
                                        onClick={closePopup}
                                    ></button>
                                </div>

                                {/* Body */}
                                <div className="modal-body">

                                    {/* Summary */}
                                    <div className="row mb-3 text-center">
                                        <div className="col-md-4">
                                            <h6>Total Bills</h6>
                                            <p className="fw-bold">{billingHistory.length}</p>
                                        </div>

                                        <div className="col-md-4">
                                            <h6>Total Amount Paid</h6>
                                            <p className="fw-bold text-success">₹ {totalAmount}</p>
                                        </div>

                                        <div className="col-md-4">
                                            <button
                                                className="btn btn-outline-dark mt-2"
                                                onClick={printPatientReport}
                                            >
                                                🖨 Print Report
                                            </button>
                                        </div>
                                    </div>

                                    {/* Billing Table */}
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
                                            {billingHistory.map((b, i) => (
                                                <tr key={i}>
                                                    <td>{new Date(b.date).toLocaleDateString()}</td>
                                                    <td>{b.service}</td>
                                                    <td>₹ {b.amount}</td>
                                                    <td>{b.paymentStatus}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Quick Add Bill */}
                                    <h5 className="fw-bold mt-4">➕ Add New Bill</h5>

                                    <form onSubmit={addQuickBill}>
                                        <div className="row g-2">
                                            <div className="col-md-5">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Service"
                                                    value={newBill.service}
                                                    onChange={(e) =>
                                                        setNewBill({ ...newBill, service: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-3">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Amount"
                                                    value={newBill.amount}
                                                    onChange={(e) =>
                                                        setNewBill({ ...newBill, amount: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-2">
                                                <select
                                                    className="form-select"
                                                    value={newBill.paymentStatus}
                                                    onChange={(e) =>
                                                        setNewBill({
                                                            ...newBill,
                                                            paymentStatus: e.target.value,
                                                        })
                                                    }
                                                >
                                                    <option value="Paid">Paid</option>
                                                    <option value="Pending">Pending</option>
                                                </select>
                                            </div>

                                            <div className="col-md-2">
                                                <button className="btn btn-success w-100">
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </form>

                                </div>

                            </div>
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default Patients;
