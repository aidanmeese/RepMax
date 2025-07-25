import mongoose from "mongoose";
import { LiftSchema, LiftTypes } from "../schemas/lift.js";
import { getUserFromId } from "./user-services.js";
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
        // calculate one_rep_max based on the epley formula
        let oneRepMax = lift.weight * (1 + lift.reps / 30)
        lift.one_rep_max = oneRepMax / (1 + 1 / 30);

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
    console.log("Getting lifts for user_id:", user_id);

    const liftModel = getDBConnection().model("Lift", LiftSchema);
    try {
        const lifts = await liftModel.find({ user_id: user_id }).select("-__v").sort({ created_at: -1 });
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
 * @param {ObjectId} user_id - to check ownership
 * @returns {Promise<Object?>} - The updated lift object or false if error
 */
export async function updateLift(lift, user_id) {
    const liftModel = getDBConnection().model("Lift", LiftSchema);
    try {
        // Check the user owns the lift
        const existingLift = await liftModel.findById(lift._id);
        if (!existingLift) {
            console.log("Lift not found");
            return false;
        } else if (existingLift.user_id.toString() !== lift.user_id.toString()) {
            console.log("Lift does not belong to user");
            return false;
        }

        // Update the updated_at field to the current date
        lift.updated_at = new Date();
        
        // Update one_rep_max based on the epley formula
        lift.one_rep_max = lift.weight * (1 + (lift.reps / 30)); // Calculate one rep max

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
 * @param {ObjectId} user_id
 * @returns {Promise<Object?>} - The deleted lift object or false if error
 */
export async function deleteLift(_id, user_id) {
    const liftModel = getDBConnection().model("Lift", LiftSchema);
    try {
        // Check if the lift belongs to the user
        const lift = await liftModel.findById(_id);
        if (!lift) {
            console.log("Lift not found");
            return false;
        }
        if (lift.user_id.toString() !== user_id.toString()) {
            console.log("Lift does not belong to user");
            return false;
        }
        const deletedLift = await liftModel.findByIdAndDelete(_id);
        return deletedLift;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * getTopLifts - Get top lifts by type
 * @param {string} weight_type - kg or lbs (optional, defaults to lbs)
 * @returns {Promise<Array<Object>?>} - The array of top lift objects or false if error
 */
export async function getTopLifts(weight_type = "lbs") {
    const liftModel = getDBConnection().model("Lift", LiftSchema);
    const topLifts = {};

    try {
        for (let type of LiftTypes) {
            const lifts = await liftModel.find({ type, weight_type })
                .sort({ one_rep_max: -1 })
                .limit(10)
                .select("-__v -created_at -updated_at");

            // Add usernames
            const liftsWithUsernames = await Promise.all(
                lifts.map(async (lift) => {
                    const user = await getUserFromId(lift.user_id);
                    return {
                        ...lift.toObject(),
                        username: user ? user.username : "Unknown User",
                    };
                })
            );

            topLifts[type] = liftsWithUsernames;
        }

        return topLifts;
    } catch (error) {
        console.error(error);
        return false;
    }
}
