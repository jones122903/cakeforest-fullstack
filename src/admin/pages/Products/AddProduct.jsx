import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Save, X, Upload, Plus, Minus } from "lucide-react";
import "./AddProduct.css";
import styles from "./AddProduct.module.css";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import { Sparkles } from "lucide-react";
import { Tag } from "lucide-react";
import { Scale } from "lucide-react";
import { IndianRupee } from "lucide-react";
import axios from "axios";
import { Cake } from "lucide-react";
import { Percent } from "lucide-react";
import { FileText } from "lucide-react";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import { CheckCircle, XCircle } from "lucide-react";
import Swal from "sweetalert2";
import { Popconfirm, Button } from "antd";

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
  const id = useLocation().state?.id;
  console.log(id);

  const [imagePreview, setImagePreview] = useState([]);

  const categories = [
    "Birthday",
    "Anniversary",
    "Kids",
    "Love",
    "Wedding",
    "Corporate",
  ];

  useEffect(() => {
    if (!id) return; // no id → it's add mode

    // 🔥 Fetch product data by ID
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${api_url}/products/${id}`);

        const p = res.data.product;

        // 🔥 Existing product details fill into form fields
        setFormData({
          cakeName: p.cakeName,
          flavor: p.flavor,
          category: p.category,
          description: p.description,
          price: p.price,
          discount: p.discount,
          weight: p.weight,
          availability: p.availability,
          stock: p.stock,
          images: p.images.map((img) => ({ preview: img })), // preview only
        });

        setImagePreview(p.images); // optional
      } catch (error) {
        showToast("error", "Failed to load product details");
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const validateForm = () => {
    if (!formData.cakeName.trim()) return "Cake Name is required";
    if (!formData.flavor) return " Select a Flavor";
    if (!formData.category) return "Select a Category";
    if (!formData.weight) return "Select a Weight";
    if (!formData.price) return "Price is required";
    if (formData.price <= 0) return "Price must be greater than 0";
    if (formData.images.length === 0) return "Please upload at least one image";

    return null; // Everything correct
  };

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

  const uploadImages = async () => {
    const imgForm = new FormData();

    // ✅ SEND CAKENAME FIRST!
    imgForm.append("cakeName", formData.cakeName);

    // Then append images
    formData.images.forEach((imgObj) => {
      imgForm.append("images", imgObj.file);
    });
    try {
      const res = await axios.post(`${api_url}/upload-images`, imgForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.images;
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Image upload failed"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) return showToast("error", errorMessage);

    try {
      let imageUrls = [];

      // 👉 ADD only: upload new images
      if (!id) {
        imageUrls = await uploadImages();
      } else {
        // 👉 EDIT: keep old images + upload only new ones
        const newFiles = formData.images.filter((img) => img.file);
        if (newFiles.length > 0) {
          const imgForm = new FormData();
          imgForm.append("cakeName", formData.cakeName);
          newFiles.forEach((i) => imgForm.append("images", i.file));

          const res = await axios.post(`${api_url}/upload-images`, imgForm);
          imageUrls = [
            ...formData.images.map((i) => i.preview),
            ...res.data.images,
          ];
        } else {
          imageUrls = formData.images.map((i) => i.preview);
        }
      }

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
        images: imageUrls,
      };

      let res;

      // 🔥 If ID exists → EDIT
      if (id) {
        res = await axios.put(`${api_url}/products/${id}`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        showToast("success", "Product updated successfully");
      } else {
        // 🔥 ADD MODE
        res = await axios.post(`${api_url}/products`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        showToast("success", "Product added successfully");
      }

      navigate("/admin/products");
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="add-product">
      <div className="page-header">
        <h1>{id ? "Edit Cake" : "Add New Cake"}</h1>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="row mt-3 ">
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
                      <TextField
                        label="Cake Name"
                        name="cakeName"
                        value={formData.cakeName}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Cake size={20} color="#2C5F7C" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Flavor */}
                <div className="col-12 col-md-6">
                  <div className={styles.formBox}>
                    <div className={styles.floatingGroup}>
                      <TextField
                        select
                        label="Flavor"
                        name="flavor"
                        value={formData.flavor}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Sparkles size={20} color="#2c5f7c" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        <MenuItem value="">Select Flavor</MenuItem>
                        <MenuItem value="chocolate"> Chocolate</MenuItem>
                        <MenuItem value="vanilla"> Vanilla</MenuItem>
                        <MenuItem value="strawberry"> Strawberry</MenuItem>
                        <MenuItem value="red-velvet"> Red Velvet</MenuItem>
                        <MenuItem value="butterscotch"> Butterscotch</MenuItem>
                        <MenuItem value="black-forest"> Black Forest</MenuItem>
                        <MenuItem value="pineapple">Pineapple</MenuItem>
                        <MenuItem value="mango">Mango</MenuItem>
                      </TextField>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="col-12 col-md-6">
                  <div className={styles.formBox}>
                    <div className={styles.floatingGroup}>
                      <TextField
                        select
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Tag size={20} color="#2C5F7C" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        <MenuItem value="">Select Category</MenuItem>
                        <MenuItem value="birthday">Birthday Cake</MenuItem>
                        <MenuItem value="wedding"> Wedding Cake</MenuItem>
                        <MenuItem value="anniversary">
                          {" "}
                          Anniversary Cake
                        </MenuItem>
                        <MenuItem value="kids"> Kids Special</MenuItem>
                        <MenuItem value="premium"> Premium Collection</MenuItem>
                        <MenuItem value="celebration"> Celebration</MenuItem>
                      </TextField>
                    </div>
                  </div>
                </div>

                {/* Weight */}
                <div className="col-12 col-md-6">
                  <div className={styles.formBox}>
                    <div className={styles.floatingGroup}>
                      <TextField
                        select
                        label="Weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        // SelectProps={{
                        //   displayEmpty: true,
                        //   renderValue: (selected) => {
                        //     if (selected === "") {
                        //       return <span style={{ color: "#888" }}>Select Weight</span>;
                        //     }
                        //     return selected + " Kg";
                        //   },
                        // }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Scale size={20} color="#2C5F7C" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        <MenuItem value="" selected>
                          Select Weight
                        </MenuItem>
                        <MenuItem value="0.5">0.5 Kg</MenuItem>
                        <MenuItem value="1">1 Kg</MenuItem>
                        <MenuItem value="1.5">1.5 Kg</MenuItem>
                        <MenuItem value="2">2 Kg</MenuItem>
                        <MenuItem value="2.5">2.5 Kg</MenuItem>
                        <MenuItem value="3">3 Kg</MenuItem>
                        <MenuItem value="4">4 Kg</MenuItem>
                        <MenuItem value="5">5 Kg</MenuItem>
                      </TextField>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="col-12 col-md-6">
                  <div className={styles.formBox}>
                    <div className={styles.floatingGroup}>
                      <TextField
                        type="tel"
                        label="Price (₹)"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IndianRupee size={20} color="#2C5F7C" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Discount */}
                <div className="col-12 col-md-6">
                  <div className={styles.formBox}>
                    <div className={styles.floatingGroup}>
                      <TextField
                        type="tel"
                        label="Discount (%)"
                        name="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        inputProps={{ min: 0, max: 100 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Percent size={20} color="#2C5F7C" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className={styles.formBox}>
                    <div className={styles.floatingGroup}>
                      <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        multiline
                        rows={2}
                        fullWidth
                        variant="outlined"
                        // InputProps={{
                        //   startAdornment: (
                        //     <InputAdornment position="top">
                        //       <FileText size={20} className="mb-4 " color="#2C5F7C" />
                        //     </InputAdornment>
                        //   ),
                        // }}
                      />
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="col-12 col-md-6 pt-2 ps-3">
                  <div className={styles.formBox}>
                    <FormControl>
                      <FormLabel sx={{ fontWeight: 600, marginBottom: 1 }}>
                        Availability Status
                      </FormLabel>

                      <RadioGroup
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        row
                      >
                        <FormControlLabel
                          value="available"
                          control={<Radio />}
                          label={
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <CheckCircle size={18} color="green" />
                              Available
                            </span>
                          }
                        />

                        <FormControlLabel
                          value="out-of-stock"
                          control={<Radio />}
                          label={
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <XCircle size={18} color="red" />
                              Out of Stock
                            </span>
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM ROW (Price / Description / Availability) */}
            <div className="row mt-4 g-3">{/* Description */}</div>
          </div>
          <div className="header-actions mt-3 ">
            <div className="mx-auto d-flex gap-3">
              <button
                className="btn-secondary "
                onClick={() => navigate("/admin/products")}
              >
                <X size={18} />
                Cancel
              </button>
              <Popconfirm
                description={
                  id
                    ? "Are you sure update this product?"
                    : "Are you sure save this product?"
                }
                onConfirm={handleSubmit}
                // onCancel={() => showToast("error", "Save cancelled")}
                okText="Yes"
                cancelText="No"
                icon={null}
                placement="top"
                okButtonProps={{
                  style: {
                    backgroundColor: "#2C5F7C", // Dark Blue (your form icons color)
                    color: "white",
                    borderRadius: "6px",
                    padding: "4px 15px",

                    border: "none",
                  },
                }}
                descriptionProps={{
                  style: {
                    fontSize: "16px",
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
                <button className="btn-primary" type="button">
                  <Save size={18} />
                  {id ? "Update Product" : "Save Product"}
                </button>
              </Popconfirm>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
