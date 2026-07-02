"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { getUserGroupsAction } from "../actions/groups";
import type { Group } from "@prisma/client";

export default async function DashboardPage() {

    const initialGroups = await getUserGroupsAction() as Group[];

    const session = await auth();

    if(!session?.user){
        redirect("/login");
    }

    return <DashboardClient initialGroups={initialGroups} />;
}