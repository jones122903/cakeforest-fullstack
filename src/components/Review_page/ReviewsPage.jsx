import { useState } from "react";
import { useSelector } from "react-redux";
import { Star, X, Upload, AlertCircle, Loader, CheckCircle } from "lucide-react";
import styles from "./reviews.module.css";
import Footer from "../footer/footer.jsx";
import FlowerAuraNavbar from "../topbar/topbar.jsx";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const ReviewsPage = () => {
  const [formData, setFormData] = useState({
    cakeId: "",
    cakeName: "",
    description: "",
    rating: 5,
    images: [],
  });
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const api_url = import.meta.env.VITE_API_URL;
  const token = useSelector((state) => state.auth.token);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (formData.images.length + files.length > 3) {
      setError("Maximum 3 images allowed");
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, file],
        }));
        setPreviews((prev) => [...prev, reader.result]);
        setError("");
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const postReview = async (formData) => {
    const data = new FormData();

    data.append("product", formData.cakeId);
    data.append("productId", formData.cakeId); // 🔥 safety
    data.append("cakeName", formData.cakeName);
    data.append("description", formData.description);
    data.append("rating", String(formData.rating)); // ensure string

    formData.images.forEach((image) => {
      data.append("images", image);
    });

    const response = await axios.post(
      `${api_url}/review`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };


  const {
    mutate: submitReview,
    isPending: loading,
  } = useMutation({
    mutationFn: postReview,
    onSuccess: (data) => {
      if (data.success) {
        setSuccess(true);
        setFormData({
          cakeId: "",
          cakeName: "",
          description: "",
          rating: 5,
          images: [],
        });
        setPreviews([]);
      } else {
        setError(data.message || "Error posting review");
      }
    },
    onError: (error) => {
      setError(
        error.response?.data?.message || "Error posting review"
      );
    },
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!token) {
      setError("Please login to submit review");
      return;
    }

    if (!formData.cakeId) {
      setError("Please select a cake");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter your review");
      return;
    }

    if (formData.images.length === 0) {
      setError("Please upload at least 1 image");
      return;
    }

    submitReview(formData);
  };



  const getProducts = async () => {
    try {
      const response = await axios.get(`${api_url}/products`)
      console.log(response.data.products, "pr")
      return response.data.products
    } catch (error) {
      console.error(error)
    }
  }

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  console.log(products, "p")

  return (
    <div className={styles.pageWrapper}>
      <FlowerAuraNavbar />

      <div className={styles.reviewsPage}>
        <div className={styles.pageIntro}>
          <h1>Share Your Experience</h1>
          <p>We'd love to hear what you think about our cakes! Your feedback helps us make every celebration even more sweet.</p>
        </div>

        <div className={styles.formCard}>
          {success ? (
            <div className={styles.successState}>
              <div className={styles.successIconWrapper}>
                <CheckCircle size={60} className={styles.successIcon} />
              </div>
              <h2>Review Posted!</h2>
              <p>Thank you for sharing your experience. Your review helps others pick their perfect cake!</p>
              <button
                className={styles.addReviewBtn}
                onClick={() => setSuccess(false)}
              >
                Share Another Review
              </button>
            </div>
          ) : (
            <form className={styles.reviewForm} onSubmit={handleSubmit}>
              <h2 className={styles.formTitle}>Write Your Review</h2>

              {error && (
                <div className={styles.errorAlert}>
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Which cake did you try? *</label>
                <select disabled={isLoading}
                  value={formData.cakeId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    if (!selectedId) return;

                    const selectedCake = products.find(
                      (cake) => cake._id === selectedId
                    );

                    if (!selectedCake) return;

                    setFormData({
                      ...formData,
                      cakeId: selectedCake._id,
                      cakeName: selectedCake.cakeName,
                    });
                  }}>

                  <option value="">
                    {isLoading ? "Loading cakes..." : "Select Cake"}
                  </option>

                  {products.map((cake) => (
                    <option key={cake._id} value={cake._id}>
                      {cake.cakeName}
                    </option>
                  ))}
                </select>


              </div>

              <div className={styles.formGroup}>
                <label>How would you rate it? *</label>
                <div className={styles.ratingInput}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`${styles.starBtn} ${star <= formData.rating ? styles.active : ""
                        }`}
                      onClick={() => setFormData({ ...formData, rating: star })}
                    >
                      <Star size={32} strokeWidth={1.5} />
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Your Experience *</label>
                <textarea
                  placeholder="What did you love about the cake?"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  maxLength="500"
                ></textarea>
                <div className={styles.charCount}>
                  {formData.description.length} / 500
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Add Cake Photos *</label>
                <div className={styles.imageUpload}>
                  <p className={styles.uploadSubtitle}>Show us your cake! (Min 1 photo, Max 3 photos)</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    id="image-input"
                    disabled={formData.images.length >= 3}
                  />
                  <label
                    htmlFor="image-input"
                    className={styles.uploadLabel}
                    style={{
                      opacity: formData.images.length >= 3 ? 0.6 : 1,
                    }}
                  >
                    <Upload size={28} strokeWidth={1.5} />
                    <span>{formData.images.length >= 3 ? "Limit reached" : "Upload photos"}</span>
                  </label>

                  {previews.length > 0 && (
                    <div className={styles.previewGrid}>
                      {previews.map((preview, index) => (
                        <div key={index} className={styles.previewContainer}>
                          <img src={preview} alt="Cake preview" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className={styles.removeImage}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? (
                  <>
                    <Loader size={18} className={styles.spinner} />
                    Posting...
                  </>
                ) : (
                  "Post Review"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReviewsPage;
