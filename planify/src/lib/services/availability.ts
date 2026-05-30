"use server";

import { prisma } from "../prisma";

export async function getAvailabilityService(userId: string, groupId: string){
    return prisma.availabilitySlot.findMany({
        where: {
            membership: {
                userId: userId,
                groupId: groupId,
            },
        },
    });
}