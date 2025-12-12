import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import "./ProductList.css";
import axios from "axios";
import { Popconfirm, Button } from "antd";
import Swal from "sweetalert2";

const ProductList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [allCakes, SetAllCakes] = useState([]);
  const api_url = import.meta.env.VITE_API_URL;
  const itemsPerPage = 10;

  const categories = [
    "all",
    "birthday",
    "anniversary",
    "kids",
    "love",
    "wedding",
  ];

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzkwZmRkMzg2NjFjOWEwYjU2YTMzNiIsImlhdCI6MTc2NTM1MTk4MSwiZXhwIjoxNzY1OTU2NzgxfQ.qIapHLuh8Ww2WIy_wO74S8rOtBiWOWuABgFFfDgs7No";

  const filteredProducts = allCakes.filter((p) => {
    const matchesSearch = p.cakeName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const showToast = async (icon, title) => {
    let timerInterval;

    const Toast = Swal.mixin({
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,

      // Progress bar color change based on success / error
      didOpen: (toast) => {
        // change progress bar color
        const progressBar = toast.querySelector(".swal2-timer-progress-bar");
        progressBar.style.background = icon === "success" ? "green" : "red";

        // Pause on hover
        toast.addEventListener("mouseenter", () => {
          Swal.stopTimer();
        });

        // Resume on mouse leave
        toast.addEventListener("mouseleave", () => {
          Swal.resumeTimer();
        });
      },

      // Custom popup color classes
      customClass: {
        popup: icon === "success" ? "colored-toast" : "colored-toast-error",
      },

      iconColor: icon === "success" ? "green" : "red",
    });

    await Toast.fire({ icon, title });
  };

  useEffect(() => {
    getALLCakes();
  }, []);

  const getALLCakes = async () => {
    try {
      const response = await axios.get(`${api_url}/products`);
      console.log(response.data.products);
      SetAllCakes(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id) => {
    console.log(id, "id");

    try {
      const response = await axios.delete(`${api_url}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showToast(
        "success",
        response.data.message || "product deleted successfully"
      );
      getALLCakes();
    } catch (error) {
      console.log(error);
    }
  };
  // 🔍 Filter Section

  // 📝 Convert for table view
  const currentProduct = filteredProducts.map((p) => ({
    id: p._id,
    weight: p.weight,
    image: `${p.images[0].trim()}`,
    name: p.cakeName,
    category: p.category,
    price: p.price,
    stock: p.stock,
    status: p.availability,
  }));

  return (
    <div className="product-list">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p className="page-subtitle">
            {filteredProducts.length} total products
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => navigate("/admin/products/add")}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Weight</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {currentProduct.length === 0 ? (
    <tr>
      <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
        No products found
      </td>
    </tr>
  ) : (
    currentProduct.map((product) => (
      <tr key={product.id}>
        <td>
          <div className="product-cell">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <span className="product-name">{product.name}</span>
          </div>
        </td>

        <td>
          <span className="stock-badge low">{product.weight} kg</span>
        </td>

        <td>
          <span className="category-badge">{product.category}</span>
        </td>

        <td className="price-cell">₹{product.price}</td>

        <td>
          <span className={`status-badge ${product.status}`}>
            {product.status}
          </span>
        </td>

        <td>
          <div className="action-buttons">
            <button
              className="action-btn edit"
              onClick={() =>
                navigate(`/admin/products/edit/${product.id}`, {
                  state: { id: product.id },
                })
              }
            >
              <Edit size={16} />
            </button>

            <Popconfirm
              description="Are you sure delete this product?"
              onConfirm={() => handleDelete(product.id)}
              okText="Yes"
              cancelText="No"
              icon={null}
              placement="top"
              okButtonProps={{
                style: {
                  backgroundColor: "#2C5F7C",
                  color: "white",
                  borderRadius: "6px",
                  padding: "4px 15px",
                  border: "none",
                },
              }}
              cancelButtonProps={{
                style: {
                  backgroundColor: "#e0e0e0",
                  color: "#444",
                  borderRadius: "6px",
                  padding: "4px 15px",
                  border: "none",
                },
              }}
            >
              <button className="action-btn delete">
                <Trash2 size={16} />
              </button>
            </Popconfirm>
          </div>
        </td>
      </tr>
    ))
  )}
</tbody>

        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <div className="pagination-numbers">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`pagination-number ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            className="pagination-btn"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
