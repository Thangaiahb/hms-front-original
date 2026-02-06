import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

const Billing = () => {
    const [bills, setBills] = useState([]);
    const [search, setSearch] = useState("");

    // ✅ Billing Form Data (Includes Age + Phone)
    const [formData, setFormData] = useState({
        patientName: "",
        age: "",
        phone: "",
        service: "",
        amount: "",
        paymentStatus: "Paid",
    });

    // ✅ Fetch Bills History
    const fetchBills = async () => {
        try {
            const res = await api.get("/bill");
            setBills(res.data);
        } catch (error) {
            console.log("Error fetching bills:", error);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    // ✅ Handle Input Change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ✅ Submit Bill (Auto Patient Link Backend)
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/bill", formData);

            alert("✅ Bill Generated + Patient Linked Successfully");

            // Reset Form
            setFormData({
                patientName: "",
                age: "",
                phone: "",
                service: "",
                amount: "",
                paymentStatus: "Paid",
            });

            fetchBills();
        } catch (error) {
            console.log("Error generating bill:", error);
            alert("❌ Failed to Generate Bill");
        }
    };

    // ✅ Print Invoice Function
    const printBill = (bill) => {
        const printWindow = window.open("", "", "width=800,height=600");

        printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2 { text-align: center; margin-bottom: 20px; }
            p { font-size: 15px; }
            hr { margin: 15px 0; }
          </style>
        </head>
        <body>
          <h2>🏥 Clinic Invoice</h2>

          <p><b>Patient:</b> ${bill.patientName}</p>
          <p><b>Phone:</b> ${bill.phone}</p>
          <p><b>Age:</b> ${bill.age}</p>

          <hr/>

          <p><b>Service:</b> ${bill.service}</p>
          <p><b>Amount:</b> ₹${bill.amount}</p>
          <p><b>Status:</b> ${bill.paymentStatus}</p>
          <p><b>Date:</b> ${new Date(bill.date).toLocaleString()}</p>

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

    // ✅ Search Filter by Name or Phone
    const filteredBills = bills.filter(
        (bill) =>
            bill.patientName.toLowerCase().includes(search.toLowerCase()) ||
            String(bill.phone).includes(search)
    );

    return (
        <Layout>
            <div className="container-fluid">

                <h2 className="fw-bold text-success mb-4">
                    💰 Billing Management
                </h2>

                {/* ✅ Add Bill Form */}
                <div className="card shadow-lg border-0 mb-4">
                    <div className="card-header bg-success text-white fw-bold">
                        ➕ Generate New Bill
                    </div>

                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">

                                {/* Patient Name */}
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">
                                        Patient Name
                                    </label>
                                    <input
                                        type="text"
                                        name="patientName"
                                        value={formData.patientName}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                {/* Phone */}
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">
                                        Mobile Number
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                {/* Age */}
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                {/* Service */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        Service Type
                                    </label>
                                    <input
                                        type="text"
                                        name="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                {/* Amount */}
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold">
                                        Amount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                {/* Status */}
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold">
                                        Payment Status
                                    </label>
                                    <select
                                        name="paymentStatus"
                                        value={formData.paymentStatus}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="Paid">Paid</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>

                                {/* Submit */}
                                <div className="col-md-12 text-end">
                                    <button type="submit" className="btn btn-primary px-4">
                                        ✅ Generate Bill
                                    </button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>

                {/* ✅ Search Bar */}
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="🔍 Search by Patient Name or Phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* ✅ Bills Table */}
                <div className="card shadow-lg border-0">
                    <div className="card-header bg-dark text-white fw-bold">
                        📋 Billing Records
                    </div>

                    <div className="card-body table-responsive">
                        <table className="table table-bordered table-hover align-middle text-center">
                            <thead className="table-secondary">
                                <tr>
                                    <th>#</th>
                                    <th>Patient</th>
                                    <th>Phone</th>
                                    <th>Service</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Print</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredBills.length > 0 ? (
                                    filteredBills.map((bill, index) => (
                                        <tr key={bill._id || index}>
                                            <td>{index + 1}</td>
                                            <td>{bill.patientName}</td>
                                            <td>{bill.phone}</td>
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

                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => printBill(bill)}
                                                >
                                                    🖨 Print
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-muted">
                                            No billing records found
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

export default Billing;
