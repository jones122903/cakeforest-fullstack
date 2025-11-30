import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X, Upload, Plus, Minus } from "lucide-react";
import "./AddProduct.css";
import styles from "./AddProduct.module.css";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    ingredients: "",
    eggType: "egg",
    stockQuantity: "",
    basePrice: "",
    status: "active",
    images: [],
  });

  const [variants, setVariants] = useState([
    { weight: "0.5", price: "" },
    { weight: "1", price: "" },
    { weight: "1.5", price: "" },
    { weight: "2", price: "" },
  ]);

  const [addOns, setAddOns] = useState([
    { name: "Rose", price: "50", selected: false },
    { name: "Teddy Bear", price: "200", selected: false },
    { name: "Chocolates", price: "150", selected: false },
  ]);

  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    "Birthday",
    "Anniversary",
    "Kids",
    "Love",
    "Wedding",
    "Corporate",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOnChange = (index, field, value) => {
    const newAddOns = [...addOns];
    if (field === "selected") {
      newAddOns[index][field] = !newAddOns[index][field];
    } else {
      newAddOns[index][field] = value;
    }
    setAddOns(newAddOns);
  };

  const addNewAddOn = () => {
    setAddOns([...addOns, { name: "", price: "", selected: false }]);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, images: [...formData.images, ...imageUrls] });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product Data:", { ...formData, variants, addOns });
    // Here you would typically send data to backend
    alert("Product added successfully!");
    navigate("/admin/products");
  };

  return (
    <div className="add-product">
      <div className="page-header">
        <h1>Add New Cake</h1>
        <div className="header-actions">
          <button
            className="btn-secondary"
            onClick={() => navigate("/admin/products")}
          >
            <X size={18} />
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            <Save size={18} />
            Save Product
          </button>
        </div>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="row mt-3 form-section">
          {/* LEFT: IMAGE UPLOAD */}
          <div className="col-12 col-md-4 mb-3">
            <div className="image-upload-section">
              <label htmlFor="images" className="upload-area">
                <Upload size={32} />
                <p>Click to upload images</p>
                <span>PNG, JPG up to 5MB</span>
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </label>

              {formData.images.length > 0 && (
                <div className="image-preview-grid">
                  {formData.images.map((img, index) => (
                    <div key={index} className="image-preview">
                      <img src={img} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeImage(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: MAIN FORM (6 FIELDS) */}
          <div className="col-12 col-md-8">
            <div className="row g-3">
              {/* Cake Name */}
              <div className="col-12 col-md-6">
                <div className={styles.formBox}>
                  <div className={styles.floatingGroup}>
                    <input
                      type="text"
                      name="cakeName"
                      value={formData.cakeName}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={styles.floatingInput}
                      required
                    />
                    <label className={styles.floatingLabel}>
                      Cake Name <span className={styles.required}>*</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Flavor */}
              <div className="col-12 col-md-6">
                <div className={styles.formBox}>
                  <div className={styles.floatingGroup}>
                    <select
                      name="flavor"
                      value={formData.flavor}
                      onChange={handleInputChange}
                      className={styles.floatingInput}
                      required
                    >
                      <option value="">Select Flavor</option>
                      <option value="chocolate">🍫 Chocolate</option>
                      <option value="vanilla">🍦 Vanilla</option>
                      <option value="strawberry">🍓 Strawberry</option>
                      <option value="red-velvet">❤️ Red Velvet</option>
                      <option value="butterscotch">🍮 Butterscotch</option>
                      <option value="black-forest">🌲 Black Forest</option>
                      <option value="pineapple">🍍 Pineapple</option>
                      <option value="mango">🥭 Mango</option>
                    </select>
                    <label className={styles.floatingLabel}>
                      Flavor <span className={styles.required}>*</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="col-12 col-md-6">
                <div className={styles.formBox}>
                  <div className={styles.floatingGroup}>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={styles.floatingInput}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="birthday">🎉 Birthday Cake</option>
                      <option value="wedding">💍 Wedding Cake</option>
                      <option value="anniversary">💕 Anniversary Cake</option>
                      <option value="kids">👶 Kids Special</option>
                      <option value="premium">✨ Premium Collection</option>
                      <option value="celebration">🎊 Celebration</option>
                    </select>
                    <label className={styles.floatingLabel}>
                      Category <span className={styles.required}>*</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Weight */}
              <div className="col-12 col-md-6">
                <div className={styles.formBox}>
                  <div className={styles.floatingGroup}>
                    <select
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className={styles.floatingInput}
                      required
                    >
                      <option value="">Select Weight</option>
                      <option value="0.5">0.5 Kg</option>
                      <option value="1">1 Kg</option>
                      <option value="1.5">1.5 Kg</option>
                      <option value="2">2 Kg</option>
                      <option value="2.5">2.5 Kg</option>
                      <option value="3">3 Kg</option>
                      <option value="4">4 Kg</option>
                      <option value="5">5 Kg</option>
                    </select>
                    <label className={styles.floatingLabel}>
                      Weight <span className={styles.required}>*</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="col-12 col-md-6">
                <div className={styles.formBox}>
                  <div className={styles.floatingGroup}>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={styles.floatingInput}
                      required
                    />
                    <label className={styles.floatingLabel}>
                      Price (₹) <span className={styles.required}>*</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Discount */}
              <div className="col-12 col-md-6">
                <div className={styles.formBox}>
                  <div className={styles.floatingGroup}>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={styles.floatingInput}
                      min="0"
                      max="100"
                    />
                    <label className={styles.floatingLabel}>Discount (%)</label>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className={styles.formBox}>
                  <div className={styles.floatingGroup}>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder=" "
                      rows="3"
                      className={styles.floatingInput}
                    />
                    <label className={styles.floatingLabel}>Description</label>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="col-12 col-md-4">
                <div className={styles.formBox}>
                  <label className={styles.staticLabel}>
                    Availability Status
                  </label>

                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="availability"
                        value="available"
                        checked={formData.availability === "available"}
                        onChange={handleInputChange}
                        className={styles.radio}
                      />
                      <span className={styles.radioText}>
                        <span
                          className={styles.statusDot}
                          data-status="available"
                        ></span>
                        Available
                      </span>
                    </label>

                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="availability"
                        value="out-of-stock"
                        checked={formData.availability === "out-of-stock"}
                        onChange={handleInputChange}
                        className={styles.radio}
                      />
                      <span className={styles.radioText}>
                        <span
                          className={styles.statusDot}
                          data-status="out-of-stock"
                        ></span>
                        Out of Stock
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW (Price / Description / Availability) */}
          <div className="row mt-4 g-3">{/* Description */}</div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
