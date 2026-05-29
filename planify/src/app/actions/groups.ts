"use server";

import { auth } from "@/auth";
import { createGroupService, getUserGroupsService, joinGroupService } from "@/lib/services/groups";

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