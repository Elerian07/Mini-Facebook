import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    content: String,

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },


}, { timestamps: true }
)


const commentModel = mongoose.model("comment", commentSchema);
export default commentModel;