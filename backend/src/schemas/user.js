import mongoose from "mongoose";
import { LiftSchema } from "./lift.js";

export const UserSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        default: "",
        required: true,
        unique: true,
    },
    lifts: {
        type: [LiftSchema],
        default: [],
    }, 
  },
  { collection: "users" },
);