import { Router } from 'express';
import { addComment, deleteComment, updateComment } from './controller/comment.controller.js';
import auth from '../../middleware/auth.js';
import validation from '../../middleware/validation.js';
import { createCommentSchema } from './comment.validation.js';
const router = Router();

router.post("/addComment/:postId", auth(), validation(createCommentSchema), addComment)
router.delete("/deleteComment/:id", auth(), deleteComment)
router.put("/updateComment/:id", auth(), updateComment)


export default router;
