"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function AvailabilityPage() {
    const params = useParams();
    const router = useRouter();
    const groupId = params.groupId as string;

    const [availabilitySlots, setAvailabilitySlots] = useState<number[]>(Array(84).fill(0)); // 7 * 12
    const [loading, setLoading] = useState(true);

    // Load existing availability
    useEffect(() => {
        // Listen for authentication state changes
        const unsub = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                router.push("/login");
                return;
            }
            else{
                // Retrieve the availability grid from the its subcollection in the Firestore DB
                const ref = doc(db, "groups", groupId, "availability", user.uid);
                const snapshot = await getDoc(ref);
                
                // If the snapshot exists, then you can update the availability slots state variable with the data from the snapshot
                if (snapshot.exists()) {
                    setAvailabilitySlots(snapshot.data().slots);
                }

                setLoading(false);
            }
        });
        
        // Clean up the listener on unmount to prevent memory leaks
        return () => unsub();
    }, [groupId]);

    
}