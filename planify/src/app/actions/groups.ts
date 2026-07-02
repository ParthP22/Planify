"use server";

import { auth } from "@/auth";
import { 
    createGroupService, 
    getGroupAvailabilityService, 
    getGroupMembersService, 
    getGroupNameService, 
    getInviteCodeService, 
    getUserGroupsService, 
    joinGroupService, 
    leaveGroupService, 
    verifyMembershipService 
} from "@/lib/services/groups";
import { AvailabilitySlotWithMembershipAndUser } from "@/lib/types/availability";
import { GroupWithCreatorAndMemberships } from "@/lib/types/group";
import { MembershipWithUser } from "@/lib/types/membership";
import type { AvailabilitySlot, Group, Membership } from "@prisma/client";

export async function createGroupAction(name: string){
    const session = await auth();

    if(!session?.user?.id){
        throw new Error("User is not authorized.");
    }   

    return await createGroupService(session.user.id, name) as GroupWithCreatorAndMemberships;
}

export async function getUserGroupsAction(){
    const session = await auth();

    if(!session?.user?.id){
        throw new Error("User is not authorized.");
    }

    return await getUserGroupsService(session.user.id) as Group[];
}

export async function joinGroupAction(inviteCode: string){
    const session = await auth();

    if(!session?.user?.id){
        throw new Error("User is not authenticated.");
    }

    return await joinGroupService(session.user.id, inviteCode) as Membership;
}

export async function getGroupAvailabilityAction(groupId: string){
    return await getGroupAvailabilityService(groupId) as AvailabilitySlotWithMembershipAndUser[];
}

export async function computeAvailabilityCountsAction(allSlots: AvailabilitySlot[]){
    const availabilityCounts = Array(168).fill(0) as number[];

    for(const slot of allSlots){
        //const index = slot.dayOfWeek * 24 + slot.slotIndex;
        const index = slot.slotIndex * 7 + slot.dayOfWeek;
        availabilityCounts[index]++;
    }

    return availabilityCounts;
}

export async function getGroupNameAction(groupId: string){
    return await getGroupNameService(groupId) as Group;
}

export async function getGroupMembersAction(groupId: string){
    return await getGroupMembersService(groupId) as MembershipWithUser[];
}

export async function getInviteCodeAction(groupId: string){
    const inviteCode = await getInviteCodeService(groupId);

    if(!inviteCode){
        return null;
    }

    return inviteCode.inviteCode as string;
}

export async function verifyMembershipAction(groupId: string){
    const session = await auth();

    if(!session?.user?.id){
        throw new Error("User is not authenticated.");
    }

    return await verifyMembershipService(session.user.id, groupId) as Membership;
}

export async function leaveGroupAction(groupId: string){
    const session = await auth();

    if(!session?.user?.id){
        throw new Error("User is not authenticated.");
    }

    return await leaveGroupService(session.user.id, groupId) as Membership;
}