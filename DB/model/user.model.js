import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: String,
    coverPic: {
        type: Array,
        default: []

    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    OTP: {
        type: String,
        default: null
    },
    posts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",

    }
}, { timestamps: true }
)


const userModel = mongoose.model("user", userSchema);
export default userModel;
