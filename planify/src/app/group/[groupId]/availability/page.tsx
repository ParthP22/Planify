"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function AvailabilityPage() {
    const NUM_ROWS = 24;
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

    function toggleSlot(index: number){
        // Fill newSlots with all the old values of availabilitySlots
        const newSlots = [...availabilitySlots];

        // Update the selected cell in the grid that the user has toggled
        newSlots[index] = newSlots[index] ? 0 : 1;

        // Update the state
        setAvailabilitySlots(newSlots);
    }  

    // Iterate over the grid's dimensions and create each of the
    // cells for the user.
    for (let row = 0; row < NUM_ROWS; row++) {
        // Create cells array for the current row
        const cells = [];

        // Create each column cell for the current row
        for (let col = 0; col < NUM_COLS; col++) {
            // Get the proper index 
            const index = row * NUM_COLS + col;

            // Retrieve whether or not this cell has been toggled
            const active = availabilitySlots[index];
            
            // Create the cell for the column in this table
            cells.push(
                <td
                    key={col}
                    onClick={() => toggleSlot(index)}
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
        
        // Add this row into the rows array
        rows.push(<tr key={row}>{cells}</tr>);
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Edit Availability</h2>
            
            {/* Availability Grid */}
            <table className="table table-bordered text-center">
                <tbody>{rows}</tbody>
            </table>
        </div>
    );

    
}