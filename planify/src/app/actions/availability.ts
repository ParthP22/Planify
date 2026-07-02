"use server";

import { auth } from "@/auth";

import { 
    getAvailabilityService, 
    saveAvailabilityService 
} from "@/lib/services/availability";

import { AvailabilitySlot } from "@prisma/client";

export async function getAvailabilityAction(groupId: string){
    const session = await auth();

    if(!session?.user?.id){
        throw new Error("User is not authenticated.");
    }

    return getAvailabilityService(session.user.id, groupId) as Promise<AvailabilitySlot[]>;
}

export async function saveAvailabilityAction(groupId: string, updatedSlots: {dayOfWeek: number, slotIndex: number}[]){
    const session = await auth();

    if(!session?.user?.id){
        throw new Error("User is not authenticated");
    }

    return saveAvailabilityService(groupId, session.user.id, updatedSlots);
}