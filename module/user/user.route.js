import { Router } from 'express';
import { getUsers, changePassword, deleteById, getUser, profilePic, cover } from './controller/user.controller.js';
import auth from '../../middleware/auth.js';
import validation from '../../middleware/validation.js';
import { restPass, deleteSchema, getUserSchema } from './user.validation.js';
import myMulter, { validationType, HM } from '../../service/multer.js';
const router = Router();

router.get("/", auth(), getUsers)

router.post("/changePass", auth(), validation(restPass), changePassword)
router.delete("/deleteUser", auth(), validation(deleteSchema), deleteById)
router.get("/getUser/:id", auth(), validation(getUserSchema), getUser)
router.get("/profilePic", auth(), myMulter(validationType.Image).single("image"), HM, profilePic)
router.get("/coverPic", auth(), myMulter(validationType.Image).single("image"), HM, cover)

export default router;

