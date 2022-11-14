import userModel from '../../../DB/model/user.model.js';
import postsModel from '../../../DB/model/post.model.js';
import commentsModel from '../../../DB/model/comment.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../../../service/cloudinary.js';


export const getUsers = async (req, res) => {
    try {
        let users = await userModel.find({});
        res.status(200).json({ message: "Done", users })
    } catch (error) {
        res.status(500).json({ message: "Error", error })
    }
}

export const changePassword = async (req, res) => {

    try {
        let { currentPassword, newPassword, newCPassword } = req.body;
        if (newPassword == newCPassword) {
            let user = await userModel.findById(req.userId);
            const matched = await bcrypt.compare(currentPassword, user.password);
            if (matched) {
                const hash = await bcrypt.hashSync(newPassword, parseInt(process.env.saltRound));
                let updatedUser = await userModel.findByIdAndUpdate(user._id, { password: hash }, { new: true })
                res.status(202).json({ message: "Updated", updatedUser })
            } else {
                res.status(406).json({ message: "current password invalid" })
            }

        } else {
            res.status(406).json({ message: "new Password and new cPassword didn't match" })
        }
    } catch (error) {
        res.status(500).json({ message: "error", error })
    }
}

export const deleteById = async (req, res) => {
    try {
        const deleteUser = await userModel.findByIdAndDelete(req.userId);
        const posts = await postsModel.deleteMany({ createdBy: req.userId })
        const comments = await commentsModel.deleteMany({ createdBy: req.userId })
        if (!deleteUser) {
            res.status(404).json({ message: "id not found" });
        } else {
            res.status(200).json({ message: "deleted", deleteUser });
        }
    } catch (error) {
        res.status(500).json({ message: "Error", error })
    }
}

export const getUser = async (req, res) => {
    try {
        let { id } = req.params;
        let user = await userModel.findById({ _id: id })
        if (!user) {
            res.status(404).json({ message: "user not found" })
        } else {
            let posts = await postsModel.find({ createdBy: id })
            res.status(200).json({ message: "Found user", user, posts })
        }
    } catch (error) {
        res.status(500).json({ message: "Error", error })
    }
}

export const profilePic = async (req, res) => {
    try {
        let { image } = req.body;
        if (req.file) {
            let uploadImg = await cloudinary.uploader.upload(req.file.path, {
                folder: "profile"
            })

            let profile = await userModel.findByIdAndUpdate(req.userId, { profilePic: uploadImg.secure_url }, { new: true })
            res.status(200).json({ message: "Done", profile })
        } else {
            res.status(404).json({ message: "you need to upload images" })
        }
    } catch (error) {
        res.status(500).json({ message: "Error", error })
    }
}

export const cover = async (req, res) => {
    try {
        let { image } = req.body;
        let uploadImg = await cloudinary.uploader.upload(req.file.path, {
            folder: "Cover"
        })
        let cover = await userModel.findByIdAndUpdate(req.userId,
            {
                coverPic: uploadImg.secure_url,
            })

        res.status(200).json({ message: "Done", cover })
    } catch (error) {
        res.status(500).json({ message: "Error", error })
    }
}