import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 64
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 128
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 128,
    }
})