import { DateTime } from "next-auth/providers/kakao";
import { Group } from "./group";

export interface User{
    id: string;
    name: string;
    email: string;
    image: string;
    createdAt: DateTime;
    memberships: Membership[];
    createdGroups: Group[];
    accounts: Account[];
    sessions: Session[];
}