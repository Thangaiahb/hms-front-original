import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

const Prescription = () => {
    // ✅ Patients from DB
    const [patients, setPatients] = useState([]);

    // ✅ Suggestions List
    const [suggestions, setSuggestions] = useState([]);

    // ✅ Form Data
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        medicines: [{ medicine: "", dosage: "", days: "" }],
    });

    // =====================================================
    // ✅ Fetch Patients from DB
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
    // ✅ Handle Patient Name Typing (Autocomplete)
    // =====================================================
    const handlePatientTyping = (e) => {
        const value = e.target.value;

        setFormData({
            ...formData,
            name: value,
            phone: "", // reset phone until selected
        });

        // Suggestion Filter
        if (value.length > 0) {
            const matches = patients.filter((p) =>
                p.name.toLowerCase().includes(value.toLowerCase())
            );

            setSuggestions(matches);
        } else {
            setSuggestions([]);
        }
    };

    // =====================================================
    // ✅ Select Suggestion Patient
    // =====================================================
    const selectPatient = (patient) => {
        setFormData({
            ...formData,
            name: patient.name,
            phone: patient.phone,
        });

        setSuggestions([]); // close suggestion list
    };

    // =====================================================
    // ✅ Handle Medicine Change
    // =====================================================
    const handleMedicineChange = (index, field, value) => {
        const updated = [...formData.medicines];
        updated[index][field] = value;

        setFormData({
            ...formData,
            medicines: updated,
        });
    };

    // Add Medicine Row
    const addMedicineRow = () => {
        setFormData({
            ...formData,
            medicines: [...formData.medicines, { medicine: "", dosage: "", days: "" }],
        });
    };

    // Remove Medicine Row
    const removeMedicineRow = (index) => {
        const updated = formData.medicines.filter((_, i) => i !== index);

        setFormData({
            ...formData,
            medicines: updated,
        });
    };

    // =====================================================
    // ✅ Submit Prescription + PDF
    // =====================================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // ✅ Save Prescription in DB
            await api.post("/prescription", formData);

            // ✅ Generate PDF
            const res = await api.post("/prescription/pdf", formData, {
                responseType: "blob",
            });

            // Download PDF
            const file = new Blob([res.data], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(file);
            link.download = "prescription.pdf";
            link.click();

            alert("✅ Prescription Saved + PDF Generated");

            // Reset Medicines
            setFormData({
                name: "",
                phone: "",
                medicines: [{ medicine: "", dosage: "", days: "" }],
            });

        } catch (error) {
            console.log("Error:", error);
            alert("❌ Failed to Generate Prescription");
        }
    };

    return (
        <Layout>
            <div className="container-fluid">

                <h2 className="fw-bold mb-4 text-primary">
                    💊 Prescription Generator (Autocomplete)
                </h2>

                <div className="card shadow-lg border-0">
                    <div className="card-header bg-primary text-white fw-bold">
                        Create Prescription
                    </div>

                    <div className="card-body">
                        <form onSubmit={handleSubmit}>

                            {/* ✅ Patient Name Autocomplete Input */}
                            <div className="mb-3 position-relative">
                                <label className="form-label fw-semibold">
                                    Patient Name
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Type patient name..."
                                    value={formData.name}
                                    onChange={handlePatientTyping}
                                    required
                                />

                                {/* Suggestions Dropdown */}
                                {suggestions.length > 0 && (
                                    <ul
                                        className="list-group position-absolute w-100 shadow"
                                        style={{
                                            zIndex: 1000,
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                        }}
                                    >
                                        {suggestions.map((p) => (
                                            <li
                                                key={p._id}
                                                className="list-group-item list-group-item-action"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => selectPatient(p)}
                                            >
                                                {p.name} ({p.phone})
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Medicines Section */}
                            <h5 className="fw-bold mt-4 mb-3">
                                💊 Medicines List
                            </h5>

                            {formData.medicines.map((med, index) => (
                                <div key={index} className="row g-2 mb-2">

                                    <div className="col-md-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Medicine"
                                            value={med.medicine}
                                            onChange={(e) =>
                                                handleMedicineChange(index, "medicine", e.target.value)
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Dosage (1-0-1)"
                                            value={med.dosage}
                                            onChange={(e) =>
                                                handleMedicineChange(index, "dosage", e.target.value)
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Days"
                                            value={med.days}
                                            onChange={(e) =>
                                                handleMedicineChange(index, "days", e.target.value)
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="col-md-2">
                                        {formData.medicines.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-danger w-100"
                                                onClick={() => removeMedicineRow(index)}
                                            >
                                                ❌ Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Add Medicine */}
                            <button
                                type="button"
                                className="btn btn-outline-primary mt-3"
                                onClick={addMedicineRow}
                            >
                                ➕ Add Another Medicine
                            </button>

                            {/* Submit */}
                            <div className="text-end mt-4">
                                <button type="submit" className="btn btn-success px-4">
                                    📄 Save + Generate PDF
                                </button>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default Prescription;
