"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function AvailabilityPage() {
    const NUM_ROWS = 12;
    const NUM_COLS = 7;

    const params = useParams();
    const router = useRouter();
    const groupId = params.groupId as string;
    const rows = [];

    const [availabilitySlots, setAvailabilitySlots] = useState<number[]>(Array(NUM_ROWS * NUM_COLS).fill(0)); // 7 * 12
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

    if (loading) {
        return <div className="container mt-5">Loading...</div>;
    }

    for (let row = 0; row < NUM_ROWS; row++) {
        const cells = [];

        for (let col = 0; col < NUM_COLS; col++) {
            const index = row * NUM_COLS + col;
            const active = availabilitySlots[index];

            cells.push(
                <td
                    key={col}
                    style={{
                    cursor: "pointer",
                    backgroundColor: active ? "#00FF00" : "#FFFFFF",
                    height: "40px"
                    }}
                >
                    {active ? "✓" : ""}
                </td>
            );
        }

        rows.push(<tr key={row}>{cells}</tr>);
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Edit Availability</h2>
            <table className="table table-bordered text-center">
                <tbody>{rows}</tbody>
            </table>
        </div>
    );

    
}