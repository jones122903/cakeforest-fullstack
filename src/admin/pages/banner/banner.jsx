import React, { useState, useRef } from "react";
import { Upload, X, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { TextField, InputAdornment } from "@mui/material";
import { Popconfirm } from "antd";
import axios from "axios";
import { showHotToast } from "../../utils/showToast.jsx";
import styles from "./banner.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Banner = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    imagePreview: null,
  });

  const fileInputRef = useRef(null);
  const api_url = import.meta.env.VITE_API_URL;
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
  const isMobile = window.innerWidth <= 700;

  /* ===================== FETCH ===================== */
  const fetchBanners = async () => {
    const res = await axios.get(`${api_url}/banner`);
    return res.data.data;
  };

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchBanners,
  });

   

  /* ===================== ADD MUTATION ===================== */
  const addBannerMutation = useMutation({
    mutationFn: async (form) => {
      return axios.post(`${api_url}/banner`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      showHotToast("success", "Banner added successfully");
      queryClient.invalidateQueries(["banners"]);

      setFormData({
        name: "",
        image: null,
        imagePreview: null,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (error) => {
      showHotToast(
        "error",
        error.response?.data?.message || "Failed to add banner"
      );
    },
  });

  /* ===================== DELETE MUTATION ===================== */
  const deleteBannerMutation = useMutation({
    mutationFn: async (id) => {
      return axios.delete(`${api_url}/banner/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      showHotToast("success", "Banner deleted successfully");
      queryClient.invalidateQueries(["banners"]);
    },
    onError: () => {
      showHotToast("error", "Failed to delete banner");
    },
  });

  /* ===================== HANDLERS ===================== */
  const handleInputChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showHotToast("error", "Image must be less than 5MB");
      return;
    }

    setFormData({
      ...formData,
      image: file,
      imagePreview: URL.createObjectURL(file),
    });
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setFormData({ ...formData, image: null, imagePreview: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Banner name is required";
    if (!formData.image) return "Banner image is required";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) return showHotToast("error", error);

    const form = new FormData();
    form.append("bannerName", formData.name);
    form.append("image", formData.image);

    addBannerMutation.mutate(form);
  };

  /* ===================== UI ===================== */
  return (
    <div className={styles.bannerContainer}>
      <h1 className={styles.bannerTitle}>Banners</h1>

      {/* ADD BANNER */}
      <div className={styles.addBannerCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div
              className={styles.imageUploadArea}
              onClick={() => fileInputRef.current.click()}
            >
              {formData.imagePreview ? (
                <div className={styles.previewContainer}>
                  <img
                    src={formData.imagePreview}
                    className={styles.previewImage}
                    alt="preview"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className={styles.removeImageBtn}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={32} />
                  <p>Click to upload banner image</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </div>

            <div className={styles.rendu}>
              <TextField
                label="Banner Name"
                fullWidth
                value={formData.name}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ImageIcon size={20} />
                    </InputAdornment>
                  ),
                }}
              />

              <button
                className={styles.submitBtn}
                type="submit"
                disabled={addBannerMutation.isLoading}
              >
                {addBannerMutation.isLoading ? (
                  "Saving..."
                ) : (
                  <>
                    <Plus /> Add Banner
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div
        className="table-container"
        style={{
          overflowX: "auto",
          scrollbarWidth: "thin",
          WebkitOverflowScrolling: "touch",
          width: isMobile ? "95vw" : "100%",
        }}
      >
        <table className="products-table w-100">
          <thead>
            <tr>
              <th>Image</th>
              <th>Banner Name</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="3"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Loading...
                </td>
              </tr>
            ) : banners.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No banners found
                </td>
              </tr>
            ) : (
              banners.map((b) => (
                <tr key={b._id}>
                  <td>
                    <img
                      src={b.image}
                      className={styles.bannerThumb}
                      alt={b.bannerName}
                    />
                  </td>

                  <td>{b.bannerName}</td>

                  <td>
                    <div className="action-buttons">
                      <Popconfirm
                        description="Are you sure delete this banner?"
                        onConfirm={() => deleteBannerMutation.mutate(b._id)}
                        okText="Yes"
                        cancelText="No"
                        placement="top"
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
  );
};

export default Banner;
