import { Prisma } from "@prisma/client";

export type MembershipWithUser = Prisma.MembershipGetPayload<{
  include: {
    user: true;
  };
}>;