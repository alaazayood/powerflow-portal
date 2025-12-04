import 'dotenv/config';
console.log('🔑 RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
console.log('🌐 NODE_ENV:', process.env.NODE_ENV); import express from 'express';
import cors from 'cors';
import { notFound, errorHandler } from './utils/error';
import authRouter from './routes/auth';
import adminRouter from './routes/admin';
import verificationRouter from './routes/verification';
import licenseRouter from './routes/license';
import invitationRouter from './routes/invitation';
import dashboardRouter from './routes/dashboard'; // Import
import helmet from 'helmet'; // Added import
import morgan from 'morgan'; // Added import

const app = express();

// Middleware
app.use(helmet()); // Added middleware
app.use(cors()); // Modified cors
app.use(express.json());
app.use(morgan('dev')); // Added middleware

// Routes
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/auth', verificationRouter); // Mount verification routes under /api/auth
app.use('/api/licenses', licenseRouter); // Changed path
app.use('/api/invitations', invitationRouter);
app.use('/api/dashboard', dashboardRouter); // Mount dashboard routes
app.use(notFound);
app.use(errorHandler);
app.listen(4000, () => {
  console.log('Server running on port 4000');
});