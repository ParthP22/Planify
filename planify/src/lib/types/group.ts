import { Prisma } from "@prisma/client";

export type GroupWithCreatorAndMemberships = Prisma.GroupGetPayload<{
  include: {
    createdBy: true;
    memberships: true;
  };
}>;