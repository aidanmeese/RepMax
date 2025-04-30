import mongoose from "mongoose";

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
  },
  { collection: "users" },
);