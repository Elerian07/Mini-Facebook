import postModel from '../../../DB/model/post.model.js';
import userModel from '../../../DB/model/user.model.js';
import cloudinary from '../../../service/cloudinary.js';

export const addPost = async (req, res) => {
    try {
        let { content, image } = req.body;
        let postImg = await cloudinary.uploader.upload(req.file.path, {
            folder: "post"
        })
        let post = new postModel({ content, images: postImg.secure_url, createdBy: req.userId });
        let savePost = await post.save();
        res.status(201).json({ message: "added", post })
    } catch (error) {
        res.status(500).json({ message: "Error", error })

    }
}

export const updatePost = async (req, res) => {
    try {
        let { id } = req.params;
        let { content, image } = req.body;
        let post = await postModel.findById({ _id: id });
        if (!post) {
            res.status(404).json({ message: "Not Found" })
        } else {
            if (post.createdBy.equals(req.userId)) {
                let image = await cloudinary.uploader.upload(req.file.path, {
                    folder: "Post Images"
                })
                let editedPost = await postModel.findByIdAndUpdate({ _id: id }, { content, images: image.secure_url }, { new: true });
                res.status(200).json({ message: "updated", editedPost })
            } else {

                res.status(401).json({ message: "you are not authorized to edit this post" })
            }


        }
    } catch (error) {
        res.status(500).json({ message: "Error", error })
    }
}

export const getPosts = async (req, res) => {
    try {
        let post = await postModel.find({})
            .populate('createdBy', 'userName -_id')
            .populate('commentIds', 'createdBy content -_id')
            .select('content images createdAt -_id')
        res.status(200).json({ message: "Done", post })
    } catch (error) {
        res.status(500).json({ message: "Error", error })
    }

}
export const getPost = async (req, res) => {
    try {

        let post = await postModel.find({ createdBy: req.userId })
            .populate('createdBy', 'userName -_id')
            .populate('commentIds', 'createdBy content -_id')
            .select('content images createdAt -_id')
        res.status(200).json({ message: "Done", post })
    } catch (error) {
        res.status(500).json({ message: "Error", error })
    }

}

export const deletePost = async (req, res) => {
    try {
        let { id } = req.params;
        let post = await postModel.findById({ _id: id })
        if (post) {
            if (post.createdBy.equals(req.userId)) {
                let deletedPost = await postModel.findByIdAndDelete({ _id: id })
                res.status(200).json({ message: "Deleted", deletedPost })
            } else {
                res.status(401).json({ message: "you are not authorized to delete this post" })
            }
        } else {
            res.status(404).json({ message: "post not found" })

        }
    } catch (error) {
        res.status(500).json({ message: "Error", error })

    }
}