import bcrypt from 'bcrypt';
import { createUser, getUser } from '../db/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { UserSchema } from '../schemas/user.js';
dotenv.config();

// Database connection setup
let dbConnection;
function getDbConnection() {
  if (!dbConnection) {
    dbConnection = mongoose.createConnection(process.env.MONGODB_URI);
  }
  return dbConnection;
}

/**
 * Generate a JWT token for the user
 * @param {string} username
 * @returns {string} JWT token
 */
function generateToken(username, id) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { username: username, id: id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' },
            (error, token) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(token);
                }
            },
        );
    });
}

/**
 * Hash the password using bcrypt
 * @param {string} password
 * @returns {string} hashed password
 */
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

/**
 * Compare the provided password with the hashed password
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {boolean} true if passwords match, false otherwise
 */
async function comparePassword(password, hashedPassword) {
    await bcrypt.compare(password, hashedPassword);
}

/**
 * Middleware to authenticate the user
 * @param {Object} req.headers.authorization - Bearer <token>
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} req.user - User object with username and id
 */
export function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    res.status(401).send("Unauthorized: No token provided");
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
      if (decoded) {
        // attach username from token payload to req.user for ease of use
        req.user = { username: decoded.username, id: decoded.id };
        next();
      } else {
        console.log("JWT error:", error);
        res.status(401).send("Unauthorized: Invalid token");
      }
    });
  }
}

/**
 * Create a new user
 * @param {Object} req.username
 * @param {Object} req.password
 * @returns {Object} success message or error message
 */
export async function createNewUser(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }
    
    try {
        // Hash the password
        const hashedPassword = await hashPassword(password);
    
        // Check for existing user
        const existingUser = await getUser(username);
        if (existingUser) return res.status(409).send("Username taken");
    
        // Create a new user
        const newUser = await createUser({ username, password: hashedPassword });
        console.log("New User: ", newUser);
        if (!newUser) return res.status(500).send("Error with createUser()");
    
        // Generate a token for the new user
        const token = await generateToken(username, newUser._id);
        return res.status(201).json({ token });
    } catch (error) {
        console.error("Error creating user: ", error);
        return res.status(500).send("Error creating user");
    }
}

/**
 * Login a user
 * @param {Object} req.username
 * @param {Object} req.password
 * @returns {Object} success message or error message
 */
export async function loginUser(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    // Get the user from the database
    const userModel = getDbConnection().model("User", UserSchema);
    const retrievedUser = await userModel.findOne({ username: username });
    if (!retrievedUser) {
        return res.status(404).send("User not found");
    }
    
    try {
        // Compare the password with the hashed password
        const isMatch = await comparePassword(password, retrievedUser.password);
        if (!isMatch) return res.status(401).send("Invalid credentials");
    
        // Generate a token for the user
        const token = await generateToken(username, retrievedUser._id);
        return res.status(200).json({ token });
    } catch (error) {
        console.error("Error logging in user: ", error);
        return res.status(500).send("Error logging in user");
    }
}

/**
 * decode user id from token
 * @param {string} token
 * @returns {Number} user_id
 */
export function decodeUserId(token) {
  return jwt.decode(token);
}