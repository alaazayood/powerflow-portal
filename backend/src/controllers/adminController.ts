import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { ApiError } from '../utils/error';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const customerId = (req as any).user?.customer_id;

        if (!customerId) {
            throw new ApiError(401, 'Unauthorized');
        }

        const users = await prisma.user.findMany({
            where: { customerId: customerId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isActive: true,
                isVerified: true
            }
        });

        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Get Users Error:', error);
        throw new ApiError(500, 'Failed to fetch users');
    }
};
