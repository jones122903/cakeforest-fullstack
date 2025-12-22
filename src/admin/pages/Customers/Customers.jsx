import React, { useEffect, useState } from "react";
import "../Dashboard/Dashboard.css";
import "./customerModal.css"; // 👈 modal css
import axios from "axios";
import { useSelector } from "react-redux";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (token) {
      fetchCustomers();
    }
  }, [token]);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${api_url}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setCustomers(res.data.details);
      }
    } catch (error) {
      console.error("Get customers error:", error);
    }
  };

  const handleViewProfile = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };
  useEffect(() => {
  if (showModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [showModal]);


  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Customers</h1>
        <p className="dashboard-subtitle">Manage your customer base</p>
      </div>

      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Total Orders</th>
              <th>Total Spent</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer._id}>
                  <td style={{ fontWeight: 600 }}>
                    {customer.fullName}
                  </td>
                  <td style={{ color: "#6b7280" }}>
                    {customer.email}
                  </td>
                  <td>{customer.phone}</td>

                 <td style={{ fontWeight: 600, color: "#667eea" }}>
                     <center>{customer.totalOrders}</center>
                  </td>

                  <td style={{ fontWeight: 600, color: "#059669" }}>
                    <center> ₹{customer.totalSpent} </center>
                  </td>

                  <td>
                    <button
                      onClick={() => handleViewProfile(customer)}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#667eea",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                      }}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 👁️ VIEW PROFILE MODAL */}
      {showModal && selectedCustomer && (
        <div className="modal-overlay">
          <div className="customer-modal">
            <div className="customer-modal-header">
              <h3>Customer Profile</h3>
              <button
                className="close-modal-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="customer-modal-body">
              <p><span>Name:</span> {selectedCustomer.fullName}</p>
              <p><span>Email:</span> {selectedCustomer.email}</p>
              <p><span>Phone:</span> {selectedCustomer.phone}</p>
              <p><span>City:</span> {selectedCustomer.city || "-"}</p>
              <p><span>Pincode:</span> {selectedCustomer.pincode || "-"}</p>
              <p><span>Address:</span> {selectedCustomer.address || "-"}</p>

              <hr />

              <p><span>Total Orders:</span> {selectedCustomer.totalOrders}</p>
              <p><span>Total Spent:</span> ₹{selectedCustomer.totalSpent}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
