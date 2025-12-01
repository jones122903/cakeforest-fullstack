import React, { useState } from "react";
import styles from "./adminAdd.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminAdd() {
  const [formData, setFormData] = useState({
    cakeName: "",
    category: "",
    flavor: "",
    weight: "",
    price: "",
    discount: "",
    eggless: "no",
    description: "",
    availability: "available",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const calculateFinalPrice = () => {
    if (formData.price && formData.discount) {
      const price = parseFloat(formData.price);
      const discount = parseFloat(formData.discount);
      return (price - (price * discount) / 100).toFixed(2);
    }
    return formData.price || "0";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Form Data:", formData);
      alert("🎂 Cake added successfully! ✨");

      setFormData({
        cakeName: "",
        category: "",
        flavor: "",
        weight: "",
        price: "",
        discount: "",
        eggless: "no",
        description: "",
        availability: "available",
        image: null,
      });
      setImagePreview(null);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className={styles.adminAddContainer}>
      <form onSubmit={handleSubmit} className={styles.addForm}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            <span className={styles.icon}>🎂</span>
            Add New Cake
          </h1>
        </div>

        <div className="row mt-3">
          <div className="col-12 col-md-4">
            <div className={styles.imageBox}>
              <div className={styles.photoUploadBox}>
                <label className={styles.uploadLabel}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                    required
                  />
                  <div className={styles.photoCircle}>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Cake"
                        className={styles.photoImage}
                      />
                    ) : (
                      <div className={styles.photoIconContainer}>
                        <div className={styles.photoIcon}>📸</div>
                        <p className={styles.uploadText}>Upload Photo</p>
                      </div>
                    )}
                  </div>
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className={styles.removePhotoBtn}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-8">
            <div className="row">
              <div className="col-12 col-md-6 ">
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
              <div className="col-12 col-md-6 ">
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
              <div className="col-12 col-md-6 mt-3">
                <div className={styles.formBox}>
                  <div className={styles.floatingGroup}>
                    <select
                      name="eggless"
                      value={formData.eggless}
                      onChange={handleInputChange}
                      className={styles.floatingInput}
                      required
                    >
                      <option value="no">🥚 With Egg</option>
                      <option value="yes">🌱 Eggless</option>
                    </select>
                    <label className={styles.floatingLabel}>
                      Egg Type <span className={styles.required}>*</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 mt-3">
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

              <div className="col-12 col-md-6 mt-3">
                <div className={`${styles.formBox} mt-3`}>
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
              <div className="col-12 col-md-6 mt-3">
                <div className={`${styles.formBox} mt-3`}>
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
            </div>
          </div>

          <div className="col-12 col-md-4 mt-4">
            <div className={`${styles.formBox} mt-3`}>
              <div className={styles.floatingGroup}>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder=" "
                  className={styles.floatingInput}
                  min="0"
                  step="0.01"
                  required
                />
                <label className={styles.floatingLabel}>
                  Price (₹) <span className={styles.required}>*</span>
                </label>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 mt-4">
            <div className={styles.formBox}>
              <div className={styles.floatingGroup}>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder=" "
                  className={styles.floatingInput}
                  rows="3"
                />
                <label className={styles.floatingLabel}>Description</label>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 mt-4">
            <div className={styles.formBox}>
              <div className={styles.formGroup}>
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

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                Adding Cake...
              </>
            ) : (
              <>
                <span className={styles.btnIcon}>✨</span>
                Add Cake
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
