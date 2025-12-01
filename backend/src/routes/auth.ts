// backend/src/routes/auth.ts
import { Router } from 'express';
import { login, register, changePassword } from '../controllers/authController';
import { verifyCode, resendVerificationCode } from '../controllers/verificationController';
import { requireAuth } from '../middlewares/auth';

const authRouter = Router();

// 🔹 مسارات المصادقة
authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/verify', verifyCode);
authRouter.post('/resend-verification', resendVerificationCode);
authRouter.get('/profile', requireAuth([])); // ✅ بدون أقواس فارغة
authRouter.post('/change-password', requireAuth([]), changePassword);

export default authRouter;