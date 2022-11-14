import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    content: String,

    images: {
        type: Array,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    commentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }]
}, { timestamps: true }
)


const postModel = mongoose.model("post", postSchema);
export default postModel;
