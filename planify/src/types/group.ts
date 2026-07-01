interface Group{
    id: string;
    name: string;
    inviteCode: string;
    createdById: string;
    createdBy: User;
    createdAt: Date;
    memberships: Membership[];
}