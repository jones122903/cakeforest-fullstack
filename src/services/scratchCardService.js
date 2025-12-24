import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL}`;

/**
 * Get all scratch cards for a specific user
 * @param {string} userId - User ID
 * @returns {Promise} Response with user's scratch cards
 */
export const getUserScratchCards = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE}/scratchcards/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user scratch cards:', error);
    throw error;
  }
};

/**
 * Reveal a scratch card
 * @param {string} cardId - Scratch card ID
 * @param {string} token - Auth token
 * @returns {Promise} Response with revealed card data
 */
export const revealScratchCard = async (cardId, token) => {
  try {
    const response = await axios.patch(
      `${API_BASE}/scratchcards/${cardId}/reveal`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error revealing scratch card:', error);
    throw error;
  }
};

/**
 * Claim reward from a winning scratch card
 * @param {string} cardId - Scratch card ID
 * @param {string} token - Auth token
 * @returns {Promise} Response with claim status
 */
export const claimReward = async (cardId, token) => {
  try {
    const response = await axios.patch(
      `${API_BASE}/scratchcards/${cardId}/claim`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error claiming reward:', error);
    throw error;
  }
};

/**
 * Get all claimed coupons for a user
 * @param {string} userId - User ID
 * @param {string} token - Auth token
 * @returns {Promise} Response with user's claimed coupons
 */
export const getUserCoupons = async (userId, token) => {
  try {
    const response = await axios.get(
      `${API_BASE}/scratchcards/user-coupons/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user coupons:', error);
    throw error;
  }
};

/**
 * Generate scratch card after order completion
 * @param {string} userId - User ID
 * @param {string} orderId - Order ID
 * @param {number} totalAmount - Order total amount
 * @param {string} token - Auth token
 * @returns {Promise} Response with generated scratch card
 */
export const generateScratchCard = async (userId, orderId, totalAmount, token) => {
  try {
    const response = await axios.post(
      `${API_BASE}/scratchcards/generate`,
      { userId, orderId, totalAmount },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error generating scratch card:', error);
    throw error;
  }
};
