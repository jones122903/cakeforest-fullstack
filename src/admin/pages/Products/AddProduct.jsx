import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X, Upload, Plus, Minus } from "lucide-react";
import "./AddProduct.css";
import styles from "./AddProduct.module.css";
import axios from "axios";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  cakeName: "",
  flavor: "",
  category: "",
  description: "",
  price: "",
  discount: "",
  weight: "",
  availability: "available",
  stock: 0,
  images: [], // after upload → URL array
});


  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzkwZmRkMzg2NjFjOWEwYjU2YTMzNiIsImlhdCI6MTc2NTM1MTk4MSwiZXhwIjoxNzY1OTU2NzgxfQ.qIapHLuh8Ww2WIy_wO74S8rOtBiWOWuABgFFfDgs7No";
  const api_url = import.meta.env.VITE_API_URL;
 

  const [imagePreview, setImagePreview] = useState([]);

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  // ⬇️ UPLOAD ALL IMAGES TO BACKEND AND RETURN URL ARRAY
const uploadImages = async () => {
  const imgForm = new FormData();  // REAL FormData

  formData.images.forEach((imgObj) => {
    imgForm.append("images", imgObj.file);
  });

  const res = await axios.post(
    `${api_url}/upload-images`,
    imgForm,
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );

  return res.data.images;   // returns array of URLs
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const imageUrls = await uploadImages();
      // 2️⃣ Build final product data
      const productData = {
  cakeName: formData.cakeName,
  flavor: formData.flavor,
  category: formData.category,
  description: formData.description,
  price: Number(formData.price),
  discount: Number(formData.discount || 0),
  weight: formData.weight,
  availability: formData.availability,
  stock: Number(formData.stock || 0),

  images: imageUrls, // from multer upload
 
};


      // 3️⃣ POST product to backend
      const res = await axios.post(`${api_url}/products`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("SUCCESS:", res.data);
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
    }
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
          <div className="col-12 col-md-12 mb-3">
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
                      <img src={img.preview} alt={`Preview ${index + 1}`} />

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
          <div className="col-12 col-md-12">
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

              <div className="col-12 col-md-6">
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
              <div className="col-12 col-md-6">
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
