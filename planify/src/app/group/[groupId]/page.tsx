"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import GroupClient from "./GroupClient";

export default async function GroupPage() {
    const session = await auth();

    if(!session?.user){
        redirect("/login");
    }

    return <GroupClient />;
}