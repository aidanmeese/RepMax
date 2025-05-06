import axios from 'axios';

export const BASE_URL = import.meta.env.DEV
    ? "http://localhost:8000"
    : "http://localhost:8000";

// ================ User Routes ================
/**
 * createUser - Create a new user in the db
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>} - The newly created user object or error message
 */
export async function createUser(username, password) {
    try {
        const response = await axios.post(`${BASE_URL}/user`, {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Error creating user: ", error);
        return null;
    }
}

/**
 * 
 */