"use server";

import { auth } from "@/auth";
import { createGroupService, getGroupAvailabilityService, getGroupMembersService, getGroupNameService, getInviteCodeService, getUserGroupsService, joinGroupService } from "@/lib/services/groups";

export async function createGroupAction(name: string){
    const session = await auth();

    if(!session?.user?.id){
        throw new Error("User is not authorized.");
    }   

    return createGroupService(session.user.id, name);
}

export async function getUserGroupsAction(){
    const session = await auth();

    if(!session?.user?.id){
        throw new Error("User is not authorized.");
    }

    return getUserGroupsService(session.user.id);
}

export async function joinGroupAction(inviteCode: string){
    const session = await auth();

    if(!session?.user?.id){
        throw new Error("User is not authenticated.");
    }

    return joinGroupService(session.user.id, inviteCode);
}

export async function getGroupAvailabilityAction(groupId: string){
    return getGroupAvailabilityService(groupId);
}

export async function computeAvailabilityCountsAction(allSlots: any){
    const availabilityCounts = Array(168).fill(0);

    for(const slot of allSlots){
        const index = slot.dayOfWeek * 24 + slot.slotIndex;
        availabilityCounts[index]++;
    }

    return availabilityCounts;
}

export async function getGroupNameAction(groupId: string){
    return await getGroupNameService(groupId);
}

export async function getGroupMembersAction(groupId: string){
    return await getGroupMembersService(groupId);
}

export async function getInviteCodeAction(groupId: string){
    const inviteCode = await getInviteCodeService(groupId);

    if(!inviteCode){
        return null;
    }

    return inviteCode.inviteCode;
}