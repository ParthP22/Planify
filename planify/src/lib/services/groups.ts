import { prisma } from "../prisma";
import { generateInviteCode } from "@/utils/groups/inviteCode";

export async function createGroup(userId: string, name: string){

    return prisma.group.create({
        data: {
            name: name,
            inviteCode: generateInviteCode(),
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