"use server";

import { prisma } from "../prisma";
import { generateInviteCode } from "@/utils/groups/inviteCode";

export async function createGroupService(userId: string, groupName: string){
    const code = generateInviteCode();

    return prisma.group.create({
        data: {
            name: groupName,
            inviteCode: code,
            createdBy: {
                connect: { id: userId },
            },
            memberships: {
                create: {
                    userId,
                    role: "OWNER",
                },
            },
        },
        // When returning, we also want to include the
        // memberships linked to this group, as well as
        // who created the group.
        include: {
            memberships: true,
            createdBy: true,
        },
    });
}

export async function getUserGroupsService(userId: string){
    return prisma.group.findMany({
        where: {
            memberships: {
                some: {
                    userId,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        }
    });
}

export async function joinGroupService(userId: string, inviteCode: string){
    const group = await prisma.group.findUnique({
        where: { inviteCode },
    });

    if(!group){
        throw new Error("Invalid invite code.");
    }

    const existingMembership = await prisma.membership.findUnique({
        where: { 
            userId_groupId: {
                userId: userId,
                groupId: group.id,
            },
        },
    });

    if(existingMembership){
        return null;
    }

    return prisma.membership.create({
        data: {
            userId: userId,
            groupId: group.id,
            role: "MEMBER",
        }
    });
}

export async function getGroupAvailabilityService(groupId: string){
    return prisma.availabilitySlot.findMany({
        where: {
            membership: {
                groupId,
            },
        },
        include: {
            membership: {
                include: {
                    user: true,
                }
            }
        }
    });
}