import postModel from '../../../DB/model/post.model.js';
import userModel from '../../../DB/model/user.model.js';
import commentModel from '../../../DB/model/comment.model.js';


export const addComment = async (req, res) => {
    try {
        let { content } = req.body;
        let { postId } = req.params;
        let post = await postModel.findById({ _id: postId })
        if (!post) {

            res.status(404).json({ message: "post Not found" })
        } else {
            let addedComment = new commentModel({ content, createdBy: req.userId })
            let savedComment = addedComment.save();
            await postModel.findByIdAndUpdate(postId, { $push: { commentIds: (await savedComment)._id } })
            res.status(201).json({ message: "added", addedComment })
        }
    } catch (error) {
        res.status(500).json({ message: "Error", error })
    }
}

export const deleteComment = async (req, res) => {
    try {
        let { id } = req.params;

        let comment = await commentModel.findById({ _id: id })
        let post = await postModel.findOne({ commentIds: comment._id })
        if (!comment) {
            res.status(404).json({ message: "can not find the comment" })
        }
        else {
            if (comment.createdBy.equals(req.userId) || post.createdBy.equals(req.userId)) {

                await postModel.findOneAndUpdate({ commentIds: comment._id }, { commentIds: [] })
                let deleted = await commentModel.findByIdAndDelete({ _id: id })
                res.status(200).json({ message: "Deleted", deleted })
            }
        }
    } catch (error) {
        res.status(500).json({ message: "Error", error })
    }
}

export const updateComment = async (req, res) => {
    let { id } = req.params;
    let { content } = req.body;
    let comment = await commentModel.findById({ _id: id })
    if (!comment) {
        res.status(404).json({ message: "comment not found" })
    } else {
        if (comment.createdBy.equals(req.userId)) {
            let updatedComment = await commentModel.findByIdAndUpdate({ _id: id }, { content }, { new: true })
            res.status(200).json({ message: "updated", updatedComment })
        } else {
            res.status(401).json({ message: "you are not authorized to update this comment" })
        }
    }
}