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
import { showHotToast } from "../../utils/showToast.jsx";
import { useSelector } from "react-redux";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cakeName: "",
    flavor: "",
    category: "",
    description: "",
    price: "",
    discount: "",
    weight: [], // Changed to array for multiple selection
    availability: "available",
    stock: 0,
    images: [], // after upload → URL array
  });

  // Get token from Redux state instead of localStorage
  const token = useSelector((state) => state.auth.token);
  const api_url = import.meta.env.VITE_API_URL;
  const id = useLocation().state?.id;
  console.log(id);

  const [imagePreview, setImagePreview] = useState([]);
  const [replaceTarget, setReplaceTarget] = useState(null);

  const categories = ["Birthday", "Anniversary", "Kids", "Love", "Wedding"];

  // Check if user is authenticated
  useEffect(() => {
    if (!token) {
      showHotToast("error", "Please login to access this page");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  }, [token, navigate]);

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
          weight: Array.isArray(p.weight)
            ? p.weight
            : p.weight
            ? [p.weight]
            : [],
          availability: p.availability,
          stock: p.stock,
          images: p.images.map((img) => ({
            preview: img.startsWith("undefined")
              ? img.replace(
                  "undefined",
                  import.meta.env.VITE_API_URL_SOUND || "http://localhost:5000"
                )
              : img,
          })),
        });

        setImagePreview(
          p.images.map((img) =>
            img.startsWith("undefined")
              ? img.replace(
                  "undefined",
                  import.meta.env.VITE_API_URL_SOUND || "http://localhost:5000"
                )
              : img
          )
        );
      } catch (error) {
        showHotToast("error", "Failed to load product details");
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    console.log("📸 Files selected:", files);
    const newFile = files[0];

    // 🔥 1️⃣ If replaceTarget is set → REPLACE MODE
    if (replaceTarget && id) {
      const newImageName = await replaceOldImage(
        replaceTarget.preview,
        newFile
      );

      setFormData((prev) => ({
        ...prev,
        images: prev.images.map((img) =>
          img.preview === replaceTarget.preview
            ? { preview: newImageName, file: null }
            : img
        ),
      }));

      setReplaceTarget(null); // reset replace mode
      return;
    }

    // 🔥 2️⃣ ADD MODE (normal upload)
    const newImages = files.map((file) => {
      const preview = URL.createObjectURL(file);
      console.log("🖼️ Created preview URL:", preview);
      return {
        file,
        preview,
      };
    });

    console.log("✅ New images array:", newImages);

    setFormData((prev) => {
      const updated = {
        ...prev,
        images: [...prev.images, ...newImages],
      };
      console.log("📦 Updated formData.images:", updated.images);
      return updated;
    });
  };

  const handleRemoveImage = async (imgObj) => {
    // If it is an old image (existing in database)
    if (!imgObj.file) {
      await deleteImageFromServer(imgObj.preview); // send filename
    }

    // Remove from frontend
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((i) => i.preview !== imgObj.preview),
    }));
  };

  const handleReplaceImage = async (oldImgObj, newFile) => {
    const newImageName = await replaceOldImage(oldImgObj.preview, newFile);

    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img) =>
        img.preview === oldImgObj.preview
          ? { preview: newImageName, file: null }
          : img
      ),
    }));
  };

  const validateForm = () => {
    if (!formData.cakeName.trim()) return "Cake Name is required";
    if (!formData.flavor) return " Select a Flavor";
    if (!formData.category) return "Select a Category";
    if (formData.weight.length === 0) return "Select at least one Weight";
    if (!formData.price) return "Price is required";
    if (formData.price <= 0) return "Price must be greater than 0";
    if (formData.discount < 0 || formData.discount > 100)
    return "Discount must be between 0 and 100";
    if (formData.images.length === 0) return "Please upload at least one image";

    return null; // Everything correct
  };

  const replaceOldImage = async (oldImageName, newFile) => {
    try {
      const form = new FormData();
      form.append("oldImage", oldImageName);
      form.append("cakeName", formData.cakeName);
      form.append("weight", formData.weight[0] || "default"); // Use first weight for folder naming
      form.append("image", newFile);

      const res = await axios.put(`${api_url}/update-image`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.image;
    } catch (err) {
      console.log(err);
    }
  };

  const deleteImageFromServer = async (imageName) => {
    try {
      await axios.delete(`${api_url}/delete-image`, {
        data: { imageName },
      });
    } catch (err) {
      console.log("Delete failed:", err);
    }
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

    imgForm.append("cakeName", formData.cakeName);
    imgForm.append("weight", formData.weight[0] || "default"); // Use first weight for folder naming

    formData.images.forEach((imgObj) => {
      imgForm.append("images", imgObj.file);
    });

    const res = await axios.post(`${api_url}/upload-images`, imgForm, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.images;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) return showHotToast("error", errorMessage);

    try {
      let imageUrls = [];

      // 👉 Identify new files (in edit mode)
      const newFiles = formData.images.filter((img) => img.file);

      if (!id) {
        // 🔥 ADD MODE
        imageUrls = await uploadImages();
      } else {
        // 🔥 EDIT MODE

        if (newFiles.length > 0) {
          const imgForm = new FormData();
          imgForm.append("cakeName", formData.cakeName);
          imgForm.append("weight", formData.weight[0] || "default"); // Use first weight for folder naming

          newFiles.forEach((i) => imgForm.append("images", i.file));

          const res = await axios.post(`${api_url}/upload-images`, imgForm, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          imageUrls = [
            ...formData.images.filter((i) => !i.file).map((i) => i.preview),
            ...res.data.images,
          ];
        } else {
          imageUrls = formData.images
            .filter((i) => !i.file)
            .map((i) => i.preview);
        }
      }

      // Final product object
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

      if (id) {
        // 🔥 UPDATE PRODUCT
        res = await axios.put(`${api_url}/products/${id}`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showHotToast("success", "Product updated successfully");
      } else {
        // 🔥 ADD PRODUCT
        res = await axios.post(`${api_url}/products`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showHotToast("success", "Product added successfully");
      }

      navigate("/admin/products");
    } catch (error) {
      console.error("Error submitting product:", error);

      // Check if it's a token-related error
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.message || "Session expired";
        showHotToast("error", errorMessage);

        // Redirect to login after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        showHotToast(
          "error",
          error.response?.data?.message || "Something went wrong"
        );
      }
    }
  };

  return (
    <div className="add-product">
      <div className="page-header">
        <h1>{id ? "Edit Cake" : "Add New Cake"}</h1>
      </div>

      <div className="product-form">
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

                {console.log(
                  "🎨 Rendering images. Count:",
                  formData.images.length,
                  "Images:",
                  formData.images
                )}

                <div className="image-preview-grid">
                  {formData.images.map((img, index) => (
                    <div key={index} className="image-preview">
                      <img src={img.preview} alt={`Preview ${index + 1}`} />

                      {console.log(`🖼️ Rendering image ${index}:`, img.preview)}

                      {/* REMOVE BUTTON */}
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => handleRemoveImage(img)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
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
                        <MenuItem value="love"> love Collection</MenuItem>
                        {/* <MenuItem value="celebration"> Celebration</MenuItem> */}
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
                        label="Weights (Select Multiple)"
                        name="weight"
                        value={formData.weight}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({
                            ...formData,
                            weight:
                              typeof value === "string"
                                ? value.split(",")
                                : value,
                          });
                        }}
                        fullWidth
                        variant="outlined"
                        SelectProps={{
                          multiple: true,
                          renderValue: (selected) =>
                            selected.join(", ") + " Kg",
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Scale size={20} color="#2C5F7C" />
                            </InputAdornment>
                          ),
                        }}
                      >
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
                        type="number"
                        label="Discount (%)"
                        name="discount"
                        value={formData.discount}
                        onChange={(e) => {
                          let value = e.target.value;

                          // Allow only 0–100
                          if (value === "") {
                            setFormData({ ...formData, discount: "" });
                            return;
                          }

                          value = Number(value);

                          if (value < 0 || value > 100) return;

                          setFormData({ ...formData, discount: value });
                        }}
                        variant="outlined"
                        fullWidth
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
      </div>
    </div>
  );
};

export default AddProduct;
