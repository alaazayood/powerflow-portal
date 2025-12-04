import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { requireAuth } from '../middlewares/auth';

const dashboardRouter = Router();

// Protected route: Only authenticated users can see stats
dashboardRouter.get('/stats', requireAuth([]), getDashboardStats);

export default dashboardRouter;
