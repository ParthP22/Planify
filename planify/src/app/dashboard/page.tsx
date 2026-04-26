"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [groupName, setGroupName] = useState("");
    const [result, setResult] = useState<any>(null);
    
    const router = useRouter();

    useEffect(() => {
            // Listen for authentication state changes
            const unsub = auth.onAuthStateChanged((user) => {
                // If the user is not logged in, redirect to the login page
                if (!user) {
                    router.push("/login");
                }
            });

            // Clean up the listener on unmount
            return () => unsub();
    }, []);

    return (
        <div className="container mt-5">
            <h1>Dashboard</h1>
            <p>You are logged in!</p>
        </div>
    );
}