"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { getAvailability, saveAvailability } from "@/lib/availability";

export default function AvailabilityPage() {
    // The availability grid will be 24 x 7,
    // for 24 hours and 7 days.
    const NUM_ROWS = 24;
    const NUM_COLS = 7;

    // React hook to access the parameters in the URL.
    // This page will be using the groupId parameter that is
    // shown in the URL.
    const params = useParams();

    // Obtain the groupId parameter from the URL
    const groupId = params.groupId as string;

    // Create router to control sending the user to other pages.
    const router = useRouter();

    // Store the rows of the grid in this array and they will
    // be displayed as a table.
    const rows = [];

    // Store the entire availability schedule in a 24 x 7 array as a state, so that
    // it tracks the latest changes as the user makes changes.
    const [availabilitySlots, setAvailabilitySlots] = useState<number[]>(Array(NUM_ROWS * NUM_COLS).fill(0)); // 7 * 12

    // Loading state to indicate if the page is loading.
    const [loading, setLoading] = useState(true);

    // Saving state to indicate if the availability schedule is saving
    const [saving, setSaving] = useState(false);

    // Load existing availability
    useEffect(() => {
        // Listen for authentication state changes
        const unsub = auth.onAuthStateChanged(async (user) => {
            // If the user is not logged in, then redirect
            // immediately to the login page
            if (!user) {
                router.push("/login");
                return;
            }
            else{
                // Obtain the availability schedule for the current user
                // from the database.
                const slots = await getAvailability(groupId, user.uid);
                if(slots !== null){
                    // If not null, we set the availability slots to this
                    setAvailabilitySlots(slots);
                }
                else{
                    // If null, it means the user hasn't ever saved their availability
                    // schedule before, so we start with a blank schedule.
                    // Ideally though, this step shouldn't be necessary, because
                    // this is what the state is initialized as.
                    setAvailabilitySlots(Array(NUM_ROWS * NUM_COLS).fill(0));
                }
            
                setLoading(false);
            }
        });
        
        // Clean up the listener on unmount to prevent memory leaks
        return () => unsub();
    }, [groupId]);

    // Show loading state if the page is still loading
    if (loading) {
        return (
            <div className="page-bg text-light">
                <h2 className="text-center">Loading... </h2>
            </div>
        );
    }

    // Function to toggle the cell selected on the availability schedule
    function toggleSlot(index: number){
        // Fill newSlots with all the old values of availabilitySlots
        const newSlots = [...availabilitySlots];

        // Update the selected cell in the grid that the user has toggled
        newSlots[index] = newSlots[index] ? 0 : 1;

        // Update the state
        setAvailabilitySlots(newSlots);
    }  

    // Format the hour based on AM or PM
    function formatHour(hour: number){
        const suffix = hour < 12 ? "AM" : "PM";
        
        // Since the hours go from 12 AM, 1 AM, ..., 12 PM, 1 PM, ..., 12 AM,
        // we need to force 12 AM/PM to be 12, not zero, when doing modulus.
        // The rest of the hours are fine though.
        const adjustedHour = (hour % 12 === 0) ? 12 : hour % 12;
        
        // Return the hour and AM/PM
        return `${adjustedHour} ${suffix}`;
    }

    // Asynchronous function to handle saving the 
    // updated schedule to the database.
    async function handleSave(){
        const user = auth.currentUser;
        
        // If the current user is not authenticated,
        // then cancel this operation.
        if(!user){
            return;
        }

        // Set the saving state to true
        setSaving(true);

        try{
            // Run the function to save the availability schedule to
            // the database
            await saveAvailability(groupId, user.uid, availabilitySlots);

            // Alert the user that it was saved
            alert("Availability saved successfully!");
            router.push(`/group/${groupId}`);
        }
        catch(error: any){
            // Alert the user with an error if the save fails
            alert("Save was unsuccessful: " + error.message);
        }
        
    }

    // Iterate over the grid's dimensions and create each of the
    // cells for the user.
    for (let row = 0; row < NUM_ROWS; row++) {
        // Create cells array for the current row
        const cells = [];

        // Add time label as the first column in the grid for the currenet row.
        // The rest of the columns in this row will be the availability grid itself,
        // which are added in the for-loop below
        cells.push(
            <td key="time" style={{ fontWeight: "bold", width: "80px" }}>
                {formatHour(row)}
            </td>
        );

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
        <div className="page-bg">
            <div className="container pt-5 pb-1">
                
                <h2 className="mb-4 display-4 text-center text-light">Edit Availability</h2>

                <div className="d-flex justify-content-between">
                    <button className="btn btn-primary" onClick={() => router.push(`/group/${groupId}`)}>
                        Back to Group
                    </button>

                    <button className="btn btn-success" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Availability"}
                    </button>
                </div>

                {/* Availability Schedule */}
                <table className="table table-bordered text-center mt-4">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Sun</th>
                            <th>Mon</th>
                            <th>Tue</th>
                            <th>Wed</th>
                            <th>Thu</th>
                            <th>Fri</th>
                            <th>Sat</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        </div>
    );

    
}