"use client";

import { computeAvailabilityCounts, computeStrictOverlap, getGroupAvailability } from "@/lib/availability";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function GroupPage() {
    const params = useParams();
    const groupId = params.groupId as string;
    const router = useRouter();
    const [overlap, setOverlap] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    const NUM_ROWS = 24;
    const NUM_COLS = 7;
    const rows = [];

    useEffect(() => {
        const fetchOverlap = async () => {
            const allSlots = await getGroupAvailability(groupId);
            const result = computeAvailabilityCounts(allSlots);
            setOverlap(result);
            setLoading(false);
        };

        fetchOverlap();
    }, [groupId]);

    function formatHour(hour: number){
        const suffix = hour < 12 ? "AM" : "PM";
        
        // Since the hours go from 12 AM, 1 AM, ..., 12 PM, 1 PM, ..., 12 AM,
        // we need to force 12 AM/PM to be 12, not zero, when doing modulus.
        // The rest of the hours are fine though.
        const adjustedHour = (hour % 12 === 0) ? 12 : hour % 12;
        
        // Return the hour and AM/PM
        return `${adjustedHour} ${suffix}`;
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
            const availableUsers = overlap[index];

            // Find the maximum number of users available
            const maxUsers = Math.max(...overlap);

            const isBestTime = availableUsers === maxUsers && maxUsers > 0;

            // Compute the intensity that the heatmap will show for this time slot
            const heatIntensity = availableUsers / maxUsers;
            
            // This determines the heat color of the current cell. The heat intensity
            // is used in the "alpha" parameter of RGBA, which defines opacity.
            let heatColor = `rgba(0, 123, 255, ${heatIntensity})`;

            if(isBestTime){
                heatColor = `rgba(0, 255, 123, ${heatIntensity})`;
            }
            
            // Create the cell for the column in this table
            cells.push(
                <td
                    key={col}
                    style={{
                    backgroundColor: availableUsers > 0 ? heatColor : "#EEEEEE",
                    height: "40px",
                    }}
                >
                    {availableUsers > 0 ? availableUsers : ""}
                </td>
            );
        }
        
        // Add this row into the rows array
        rows.push(<tr key={row}>{cells}</tr>);
    }

    if(loading){
      return <p>Loading... </p>;
    }

    return (
        <div className="container mt-5">
            <h1>Group</h1>
            <p>Group ID: {groupId}</p>
            
            <button onClick={() => router.push(`/group/${groupId}/availability`)}>
                Edit My Availability
            </button>

            {/* Availability Grid */}
              {overlap.length === 0 ? (
                  <p>No availability has been entered</p>
                ) : (
                  <table className="table table-bordered text-center">
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
                )
              }
        </div>

      
    );
}