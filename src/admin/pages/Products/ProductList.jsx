import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import "./ProductList.css";
import axios from "axios";
import { Popconfirm, Button } from "antd";
import { Pagination } from "@mui/material";
import Swal from "sweetalert2";
import { showHotToast } from "../../utils/showToast.jsx";
import { useSelector } from "react-redux";

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
    "designer",
    "fruits",
    "photo",
    "bento",
  ];

  // Get token from Redux state
  const token = useSelector((state) => state.auth.token);

  const filteredProducts = allCakes.filter((p) => {
    const matchesSearch = p.cakeName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Normalize category comparison - convert both to lowercase for matching
    const productCategories = Array.isArray(p.category)
      ? p.category.map(cat => cat?.toLowerCase?.() || cat)
      : [p.category?.toLowerCase?.() || p.category];

    const matchesCategory =
      selectedCategory === "all" ||
      productCategories.includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const isMobile = window.innerWidth <= 700;

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
      showHotToast(
        "success",
        response.data.message || "product deleted successfully"
      );
      getALLCakes();
    } catch (error) {
      console.log(error);
    }
  };
  // 🔍 Filter Section

  // 📝 Convert PAGINATED products for table view (use currentProducts, not filteredProducts)
  const currentProduct = currentProducts.map((p) => ({
    id: p._id,
    weight: p.weight,
    image: `${p.images[0]?.trim() || ''}`,
    name: p.cakeName,
    category: Array.isArray(p.category) ? p.category[0] : p.category,
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
              className={`filter-btn ${selectedCategory === cat ? "active" : ""
                }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div
        className="table-container"
        style={{
          overflowX: "auto",
          scrollbarWidth: "thin",
          WebkitOverflowScrolling: "touch",
          width: isMobile ? "95vw" : "",
        }}
      >
        <div className="products-table"  >

          <table className="w-100" >
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
                          src={product.image.startsWith('undefined')
                            ? product.image.replace('undefined', import.meta.env.VITE_API_URL_SOUND || 'http://localhost:5000')
                            : product.image}
                          alt={product.name}
                          className="product-image"
                        />
                        <span className="product-name">{product.name}</span>
                      </div>
                    </td>

                    <td data-label="Weight">
                      <span className="stock-badge low">{product.weight} kg</span>
                    </td>

                    <td data-label="Category">
                      <span className="category-badge">{product.category}</span>
                    </td>

                    <td data-label="Price" className="price-cell">
                      ₹{product.price}
                    </td>

                    <td data-label="Status">
                      <span className={`status-badge ${product.status}`}>
                        {product.status}
                      </span>
                    </td>

                    <td data-label="Actions">
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            variant="outlined"
            color="primary"
            showFirstButton
            showLastButton
            size="medium"
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;
