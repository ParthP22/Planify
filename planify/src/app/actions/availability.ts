"use server";

import { auth } from "@/auth";
import { getAvailabilityService, saveAvailabilityService } from "@/lib/services/availability";

export async function getAvailabilityAction(groupId: string){
    const session = await auth();

    if(!session?.user?.id){
        throw new Error("User is not authenticated.");
    }

    return await getAvailabilityService(session.user.id, groupId);
}

export async function saveAvailabilityAction(groupId: string, updatedSlots: {dayOfWeek: number, slotIndex: number}[]){
    const session = await auth();

    if(!session?.user?.id){
        throw new Error("User is not authenticated");
    }

    return await saveAvailabilityService(groupId, session.user.id, updatedSlots);
}