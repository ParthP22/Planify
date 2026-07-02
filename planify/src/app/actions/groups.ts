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

    return createGroupService(session.user.id, name) as Promise<GroupWithCreatorAndMemberships>;
}

export async function getUserGroupsAction(){
    const session = await auth();

    if(!session?.user?.id){
        throw new Error("User is not authorized.");
    }

    return getUserGroupsService(session.user.id) as Promise<Group[]>;
}

export async function joinGroupAction(inviteCode: string){
    const session = await auth();

    if(!session?.user?.id){
        throw new Error("User is not authenticated.");
    }

    return joinGroupService(session.user.id, inviteCode) as Promise<Membership>;
}

export async function getGroupAvailabilityAction(groupId: string){
    return getGroupAvailabilityService(groupId) as Promise<AvailabilitySlotWithMembershipAndUser[]>;
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
    return getGroupNameService(groupId) as Promise<Group>;
}

export async function getGroupMembersAction(groupId: string){
    return getGroupMembersService(groupId) as Promise<MembershipWithUser[]>;
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

    return verifyMembershipService(session.user.id, groupId) as Promise<Membership>;
}

export async function leaveGroupAction(groupId: string){
    const session = await auth();

    if(!session?.user?.id){
        throw new Error("User is not authenticated.");
    }

    return leaveGroupService(session.user.id, groupId) as Promise<Membership>;
}