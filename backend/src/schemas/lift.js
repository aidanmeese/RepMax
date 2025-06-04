import mongoose from 'mongoose';

export const LiftTypes = [
    'Bench Press',
    'Squat',
    'Deadlift',
    'Other'
];
export const LiftSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: LiftTypes,
        default: 'Other',
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    reps: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    weight_type: {
        type: String,
        enum: ['kg', 'lbs'],
        required: true,
    },
    one_rep_max: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
},
{collection: 'lifts'});