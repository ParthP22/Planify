import { Prisma } from "@prisma/client";

export type AvailabilitySlotWithMembershipAndUser =
  Prisma.AvailabilitySlotGetPayload<{
    include: {
      membership: {
        include: {
          user: true;
        };
      };
    };
  }>;