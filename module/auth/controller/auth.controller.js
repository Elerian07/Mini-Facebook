import userModel from '../../../DB/model/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { sendEmail } from '../../../service/sendEmail.js'

export const signUp = async (req, res) => {
    try {
        let { userName, email, password, cPassword } = req.body;
        if (password == cPassword) {
            const user = await userModel.findOne({ email })
            if (user) {
                res.json({ message: "you are already register" })
            } else {
                const hash = await bcrypt.hashSync(password, parseInt(process.env.saltRound))

                const signUp = await userModel({ userName, email, password: hash })

                const signedUp = await signUp.save();
                let token = jwt.sign({ id: signedUp.id }, process.env.tokenEmailKey, { expiresIn: 60 * 60 })
                const refreshToken = jwt.sign({ id: signedUp.id }, process.env.refreshToken)
                let message = `<a href= "http://localhost:3000${process.env.baseUrl}auth/confirmEmail/${token}"> please click here to confirm your email</a>
                <br>
                <br>
                <a href = "http://localhost:3000${process.env.baseUrl}auth/refresh/${refreshToken}"> if the first link didn't work click here to get a new link </a>
                `
                sendEmail(email, message)
                res.json({ message: "you are signed up please confirm your email" })
            }
        } else {
            res.json({ message: "password dose not match cPassword" })
        }
    } catch (error) {
        res.json({ message: "Error", error })
    }
}

export const signIn = async (req, res) => {
    try {
        let { email, password } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) {
            res.json({ message: "you need to register first" })
        } else {
            const match = await bcrypt.compareSync(password, user.password)
            if (match) {
                if (user.isConfirmed) {
                    const token = jwt.sign({ id: user._id }, process.env.tokenKey)
                    res.json({ message: "welcome, you are signed in ", token })
                } else {
                    res.json({ message: "you need to confirm your email first" })
                }
            } else {
                res.json({ message: "incorrect password" })
            }
        }
    } catch (error) {
        res.json({ message: "Error", error })
    }
}

export const confirmEmail = async (req, res) => {
    try {
        let token = req.params;
        let decoded = jwt.verify(token.process.env.tokenEmailKey)
        if (decoded) {
            let user = await userModel.findById({ _id: decoded.id, isConfirmed: false })
            if (user) {
                let updated = await userModel.findByIdAndUpdate(decoded.id, { isConfirmed: true }, { new: true })
                res.json({ message: "confirmed", updated })
            } else {
                res.json({ message: "you are already confirmed" })
            }
        } else {
            res.json({ message: "invalid token" })
        }
    } catch (error) {
        res.json({ message: "Error", error })
    }
}

export const refresh = async (req, res) => {
    try {
        let { token } = req.params;
        let decoded = jwt.verify(token, process.env.tokenEmailKey)
        if (!decoded && !decoded.id) {
            res.json({ message: "invalid token or id" })
        } else {
            let user = await userModel.findById(decoded.id)
            if (!user) {
                res.json({ message: "user didn't register" })
            } else {
                if (user.isConfirmed) {
                    res.json({ message: "this email is confirmed" })
                } else {
                    let tokenKey = jwt.sign(user._id, process.env.tokenKey)
                    let token = jwt.sign(user._id, process.env.tokenEmailKey)
                    let message = `<a href = "http://localhost:3000${process.env.baseUrl}auth/refresh/${tokenKey}"> please click here to confirm your email again</a>`
                    sendEmail(user.email, message)
                    res.json({ message: "please check your email" });
                }
            }
        }
    } catch (error) {
        res.json({ message: "Error", error })
    }
}

export const Otp = async (req, res) => {
    try {
        let { email } = req.body;
        let user = await userModel.findOne({ email })
        if (!user) {
            res.json({ message: "you aren't register" })
        } else {
            let OTP = nanoid();
            await userModel.findByIdAndUpdate(user._id, { OTP })
            let message = `your OTP is ${OTP}`;
            sendEmail(user.email, message)
            res.json({ message: "please check your email to get your OTP" })
        }
    } catch (error) {
        res.json({ message: "Error", error })
    }
}

export const forgetPass = async (req, res) => {
    try {
        let { email, newPassword, newCPassword, OTP } = req.body;
        if (newPassword == newCPassword) {
            let user = await userModel.findOne({ email, OTP })
            if (!OTP) {
                res.json({ message: "invalid OTP" })
            }
            if (user) {
                let hash = await bcrypt.hashSync(newPassword, parseInt(process.env.saltRound))
                let updated = await userModel.findByIdAndUpdate(user._id, { password: hash, OTP: null }, { new: true })
                res.status(200).json({ message: "password updated" })
            } else {
                res.status(404).json({ message: "invalid email" })
            }
        } else {
            res.status(406).json({ message: "password doesn't match cPassword" })
        }
    } catch (error) {
        res.status(500).json({ message: "Error", error })
    }
}