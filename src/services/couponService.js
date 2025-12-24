import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL}`;

/**
 * Get all active public coupons
 * @returns {Promise} Response with active coupons
 */
export const getActiveCoupons = async () => {
  try {
    const response = await axios.get(`${API_BASE}/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching active coupons:', error);
    throw error;
  }
};

/**
 * Validate a coupon before applying
 * @param {string} userId - User ID
 * @param {string} couponCode - Coupon code to validate
 * @param {number} orderAmount - Order total amount
 * @returns {Promise} Response with validation result
 */
export const validateCoupon = async (userId, couponCode, orderAmount) => {
  try {
    const response = await axios.post(`${API_BASE}/coupons/validate`, {
      userId,
      couponCode,
      orderAmount
    });
    return response.data;
  } catch (error) {
    console.error('Error validating coupon:', error);
    throw error;
  }
};

/**
 * Apply coupon at checkout
 * @param {string} userId - User ID
 * @param {string} couponCode - Coupon code
 * @param {string} orderId - Order ID
 * @param {number} orderAmount - Order total amount
 * @returns {Promise} Response with applied coupon details
 */
export const applyCoupon = async (userId, couponCode, orderId, orderAmount) => {
  try {
    const response = await axios.post(`${API_BASE}/coupons/apply-user`, {
      userId,
      couponCode,
      orderId,
      orderAmount
    });
    return response.data;
  } catch (error) {
    console.error('Error applying coupon:', error);
    throw error;
  }
};

/**
 * Apply coupon (existing endpoint - for compatibility)
 * @param {string} code - Coupon code
 * @param {number} orderAmount - Order total amount
 * @returns {Promise} Response with discount details
 */
export const applyExistingCoupon = async (code, orderAmount) => {
  try {
    const response = await axios.post(`${API_BASE}/apply`, {
      code,
      orderAmount
    });
    return response.data;
  } catch (error) {
    console.error('Error applying coupon:', error);
    throw error;
  }
};
