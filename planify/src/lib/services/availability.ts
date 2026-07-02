"use server";

import type { AvailabilitySlot } from "@prisma/client";
import { prisma } from "../prisma";

export async function getAvailabilityService(userId: string, groupId: string){
    return prisma.availabilitySlot.findMany({
        where: {
            membership: {
                userId: userId,
                groupId: groupId,
            },
        },
    }) as Promise<AvailabilitySlot[]>;
}

export async function saveAvailabilityService(groupId: string, userId: string, updatedSlots: {dayOfWeek: number, slotIndex: number}[]){
    const membership = await prisma.membership.findUnique({
        where: {
            userId_groupId: {
                userId: userId,
                groupId: groupId,
            },
        },
    });

    if(!membership){
        return;
    }

    const membershipId = membership.id;
    
    await prisma.$transaction([
        prisma.availabilitySlot.deleteMany({
            where: {
                membershipId: membershipId,
            },
        }),

        prisma.availabilitySlot.createMany({
            data: updatedSlots.map((slot) => ({
                membershipId: membershipId,
                dayOfWeek: slot.dayOfWeek,
                slotIndex: slot.slotIndex
            
            })),
        }),
    ]);
}