import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { ApiError } from '../utils/error';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const customerId = (req as any).user?.customer_id;

        if (!customerId) {
            throw new ApiError(401, 'User not authenticated');
        }

        // 1. Fetch all licenses for this customer
        const licenses = await prisma.license.findMany({
            where: { customerId: customerId }
        });

        // 2. Calculate Stats
        const now = new Date();

        // Active Licenses: Not expired and marked as active
        const activeLicenses = licenses.filter(
            l => l.isActive && new Date(l.expiryDate) > now
        );

        // Total Seats: Sum of seatNumber from all active licenses
        const totalSeats = activeLicenses.reduce((sum, l) => sum + l.seatNumber, 0);

        // Seats Used: 
        // Logic: If pcUuid is present, it counts as used. 
        // Note: This assumes 1 license row = 1 activation for now, or that pcUuid indicates usage.
        // If a license has 5 seats but only 1 pcUuid field, we can't track 3/5 used without a separate table.
        // For now, we'll count it as "1 used" if pcUuid exists, or maybe we need a better logic later.
        const seatsUsed = activeLicenses.filter(l => l.pcUuid).length;

        // Plan Name: Take the type of the latest active license, or 'Free'
        // Sort by expiry date descending
        const latestLicense = activeLicenses.sort((a, b) =>
            new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()
        )[0];

        const planName = latestLicense ? latestLicense.type : 'Free Plan';
        const expiryDate = latestLicense ? latestLicense.expiryDate : null;

        // Customer Name (Organization Name)
        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            select: { companyName: true, firstName: true, lastName: true }
        });

        const customerName = customer?.companyName || `${customer?.firstName} ${customer?.lastName}`;

        res.json({
            success: true,
            stats: {
                activeLicenses: activeLicenses.length,
                totalSeats,
                seatsUsed,
                planName,
                expiryDate,
                customerName,
                customerId
            }
        });

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        throw new ApiError(500, 'Failed to fetch dashboard stats');
    }
};
