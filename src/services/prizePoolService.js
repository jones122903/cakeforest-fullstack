import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL}`;

/**
 * Get all prize pools (admin)
 * @param {string} token - Auth token
 * @returns {Promise} Response with all prize pools
 */
export const getAllPrizePools = async (token) => {
  try {
    const response = await axios.get(`${API_BASE}/admin/prize-pools`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching prize pools:', error);
    throw error;
  }
};

/**
 * Get statistics for a specific prize pool
 * @param {string} id - Prize pool ID
 * @param {string} token - Auth token
 * @returns {Promise} Response with prize pool statistics
 */
export const getPrizePoolStats = async (id, token) => {
  try {
    const response = await axios.get(`${API_BASE}/admin/prize-pools/${id}/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching prize pool stats:', error);
    throw error;
  }
};

/**
 * Create a new prize pool
 * @param {Object} data - Prize pool data
 * @param {string} token - Auth token
 * @returns {Promise} Response with created prize pool
 */
export const createPrizePool = async (data, token) => {
  try {
    const response = await axios.post(`${API_BASE}/admin/prize-pools`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating prize pool:', error);
    throw error;
  }
};

/**
 * Update an existing prize pool
 * @param {string} id - Prize pool ID
 * @param {Object} data - Updated prize pool data
 * @param {string} token - Auth token
 * @returns {Promise} Response with updated prize pool
 */
export const updatePrizePool = async (id, data, token) => {
  try {
    const response = await axios.put(`${API_BASE}/admin/prize-pools/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating prize pool:', error);
    throw error;
  }
};

/**
 * Deactivate a prize pool
 * @param {string} id - Prize pool ID
 * @param {string} token - Auth token
 * @returns {Promise} Response with deactivation status
 */
export const deactivatePrizePool = async (id, token) => {
  try {
    const response = await axios.patch(
      `${API_BASE}/admin/prize-pools/${id}/deactivate`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error deactivating prize pool:', error);
    throw error;
  }
};
