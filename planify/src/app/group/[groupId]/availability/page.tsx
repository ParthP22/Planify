"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AvailabilityClient from "./AvailabilityClient";

export default async function AvailabilityPage() {
    const session = await auth();

    if(!session?.user){
        redirect("/login");
    }

    return <AvailabilityClient />
    
}