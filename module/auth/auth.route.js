import { Router } from 'express';
import { signUp, signIn, confirmEmail, refresh, Otp, forgetPass } from './controller/auth.controller.js';
import validation from '../../middleware/validation.js';
import { signUpSchema, signInSchema, forgetPassSchema } from './auth.validation.js'
const router = Router();

router.post("/signUp", validation(signUpSchema), signUp)
router.post("/signIn", validation(signInSchema), signIn)
router.get("/confirmEmail/:token", confirmEmail)
router.get("/refresh/:token", refresh)
router.post("/OTPCode", Otp)
router.post("/forgetPass", validation(forgetPassSchema), forgetPass)

export default router;