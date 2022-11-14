import { Router } from 'express';
import { addPost, updatePost, getPosts, deletePost, getPost } from './controller/post.controller.js';
import auth from '../../middleware/auth.js';
import myMulter, { validationType, HM } from '../../service/multer.js';
const router = Router();

router.post("/add", auth(), myMulter(validationType.Image).single("image"), HM, addPost)
router.patch("/update/:id", auth(), myMulter(validationType.Image).single("image"), HM, updatePost)
router.get("/getPost", auth(), getPosts)
router.get("/getUserPost", auth(), getPost)
router.delete("/deletePost/:id", auth(), deletePost)
export default router;
