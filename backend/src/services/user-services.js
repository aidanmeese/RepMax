import mongoose from "mongoose";
import { UserSchema } from "../schemas/user.js";
import { getLifts } from "./lift-services.js";
import dotenv from "dotenv";
dotenv.config();

let dbConnection;

export function setConnection(connection) {
  dbConnection = connection;
  return dbConnection;
}

function getDBConnection() {
    if (!dbConnection) {
        dbConnection = mongoose.createConnection(process.env.MONGODB_URI);
    }
    return dbConnection;
}

/**
 * createUser - Create a new single user in the db
 * @param {Object} user 
 * @param {string} user.username
 * @param {string} user.password - Hashed password
 * @returns {Promise<Object?>} - The newly created user object or false if error
 */
export async function createUser(user) {
    const userModel = getDBConnection().model("User", UserSchema);
    try {
        const newUser = new userModel(user);
        await newUser.save();
        return newUser;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * getUser - Get a single user from db with username
 * @param {string} username 
 * @returns {Promise<Object?>} - The user object or false if error
 */
export async function getUser(username) {
    const userModel = getDBConnection().model("User", UserSchema);
    try {
        // Find without password
        const user = await userModel.findOne({ username: username }).select("-password -__v");
        
        if (!user) return null;

        // Add lifts to user object
        user.lifts = await getLifts(user._id);

        return user;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * getUserFromId - Get a single username from db with user_id
 * @param {ObjectId} user_id
 * @returns {Promise<Object?>} - The user object or false if error
 */
export async function getUserFromId(user_id) {
    const userModel = getDBConnection().model("User", UserSchema);
    try {
        // Find just username
        const user = await userModel.findById(user_id).select("username -_id");
        
        if (!user) return null;

        return user;
    } catch (error) {
        console.log(error);
        return false;
    }
}