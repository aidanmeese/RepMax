import mongoose from "mongoose";
import { LiftSchema } from "../schemas/lift.js";
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
 * createLift - Create a new single lift in the db
 * @param {ObjectId} lift.user_id
 * @param {string} lift.type
 * @param {number} lift.reps
 * @param {number} lift.weight
 * @param {string} lift.weight_type - kg or lbs
 * @returns {Promise<Object?>} - The newly created lift object or false if error
 */
export async function createLift(lift) {
    const liftModel = getDBConnection().model("Lift", LiftSchema);
    try {
        const newLift = new liftModel(lift);
        await newLift.save();
        return newLift;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * getLifts - Get all lifts from db with user_id
 * @param {ObjectId} user_id
 * @returns {Promise<Array<Object>?>} - The array of lift objects or false if error
 */
export async function getLifts(user_id) {
    const liftModel = getDBConnection().model("Lift", LiftSchema);
    try {
        const lifts = await liftModel.find({ user_id: user_id }).sort({ created_at: -1 });
        return lifts;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * updateLift - Update a single lift in the db
 * @param {ObjectId} lift._id
 * @param {ObjectId} lift.user_id
 * @param {string} lift.type
 * @param {number} lift.reps
 * @param {number} lift.weight
 * @param {string} lift.weight_type - kg or lbs
 * @returns {Promise<Object?>} - The updated lift object or false if error
 */
export async function updateLift(lift) {
    const liftModel = getDBConnection().model("Lift", LiftSchema);
    try {
        // Update the updated_at field to the current date
        lift.updated_at = new Date();

        const updatedLift = await liftModel.findByIdAndUpdate(lift._id, lift, { new: true });
        return updatedLift;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * deleteLift - Delete a single lift in the db
 * @param {ObjectId} _id
 * @returns {Promise<Object?>} - The deleted lift object or false if error
 */
export async function deleteLift(_id) {
    const liftModel = getDBConnection().model("Lift", LiftSchema);
    try {
        const deletedLift = await liftModel.findByIdAndDelete(_id);
        return deletedLift;
    } catch (error) {
        console.log(error);
        return false;
    }
}