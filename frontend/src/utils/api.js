import axios from 'axios';
import { getDefaultStore } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const BASE_URL = import.meta.env.DEV
    ? "http://localhost:8000"
    : "http://localhost:8000";

const store = getDefaultStore();
export const INVALID_TOKEN = "invalid_token";
export const tokenAtom = atomWithStorage("token", INVALID_TOKEN, undefined, undefined, { getOnInIt: true });
// accessible in react components with useAtom(tokenAtom)
// accessible elsewhere with store.get(tokenAtom)

export const expirationAtom = atomWithStorage(
  "expiration",
  Date.now(),
  undefined,
  {
    getOnInit: true,
  },
);
const EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hours

export function signout() {
  store.set(tokenAtom, INVALID_TOKEN);
}

// ================ User Routes ================
/**
 * signUpUser - Create a new user in the db
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ success: boolean, error?: string }>} - State of the request
 */
export async function signUpUser(username, password) {
    try {
        const response = await axios.post(`${BASE_URL}/signup`, {
            username,
            password,
        });
        store.set(tokenAtom, response.data.token);
        store.set(expirationAtom, Date.now() + EXPIRATION_TIME);
        return { success: true };
    } catch (error) {
        console.log(error);
        store.set(tokenAtom, INVALID_TOKEN);
        return { success: false, error: error.response.data };
    }
}

/**
 * loginUser - Login a user in the db
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ success: boolean, error?: string }>} - State of the request
 */
export async function loginUser(username, password) {
    try {
        const response = await axios.post(`${BASE_URL}/login`, {
            username,
            password,
        });
        store.set(tokenAtom, response.data.token);
        store.set(expirationAtom, Date.now() + EXPIRATION_TIME);
        return { success: true };
    } catch (error) {
        console.log(error);
        store.set(tokenAtom, INVALID_TOKEN);
        return { success: false, error: error.response.data };
    }
}

export function addAuthHeader(otherHeaders = {}) {
  const token = store.get(tokenAtom);
  if (token === INVALID_TOKEN) {
    return otherHeaders;
  } else {
    return {
      ...otherHeaders,
      Authorization: `Bearer ${token}`,
    };
  }
}

/**
 * getUser - Get a single user from the db with username
 * @param {string} username
 * @returns {Promise<Object>} - The user object or error message
 */
export async function getUser(username) {
    try {
        const response = await axios.get(`${BASE_URL}/user/${username}`);
        return response.data;
    } catch (error) {
        console.error("Error getting user: ", error);
        return null;
    }
}

// ================ Lift Routes ================
/**
 * createLift - Create a new lift in the db
 * @param {string} user_id
 * @param {string} type
 * @param {number} reps
 * @param {number} weight
 * @param {string} weight_type - kg or lbs
 * @returns {Promise<Object>} - The newly created lift object or error message
 */
export async function createLift(user_id, type, reps, weight, weight_type) {
    try {
        const response = await axios.post(`${BASE_URL}/lift`, {
            user_id,
            type,
            reps,
            weight,
            weight_type,
        });
        return response.data;
    } catch (error) {
        console.error("Error creating lift: ", error);
        return null;
    }
}

/**
 * getLifts - Get all lifts for a user
 * @param {string} user_id
 * @returns {Promise<Array>} - An array of lift objects or error message
 */
export async function getLifts(user_id) {
    try {
        const response = await axios.get(`${BASE_URL}/lifts/${user_id}`);
        return response.data;
    } catch (error) {
        console.error("Error getting lifts: ", error);
        return null;
    }
}

/**
 * deleteLift - Delete a lift from the db
 * @param {string} lift_id
 * @returns {Promise<Object>} - Success message or error message
 */
export async function deleteLift(lift_id) {
    try {
        const response = await axios.delete(`${BASE_URL}/lift/${lift_id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting lift: ", error);
        return null;
    }
}

/**
 * updateLift - Update a lift in the db
 * @param {string} lift_id
 * @param {Object} updates - The updates to be made
 * @param {string} updates.user_id
 * @param {string} updates.type
 * @param {number} updates.reps
 * @param {number} updates.weight
 * @param {string} updates.weight_type - kg or lbs
 * @returns {Promise<Object>} - The updated lift object or error message
 */
export async function updateLift(lift_id, updates) {
    try {
        const response = await axios.put(`${BASE_URL}/lift/${lift_id}`, updates);
        return response.data;
    } catch (error) {
        console.error("Error updating lift: ", error);
        return null;
    }
}