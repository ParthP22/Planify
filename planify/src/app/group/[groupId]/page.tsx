"use client";

import { computeAvailabilityCounts, computeStrictOverlap, getGroupAvailability } from "@/lib/availability";
import { getGroupMembers, getGroupName, leaveGroup } from "@/lib/groups";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";

export default function GroupPage() {
    const params = useParams();
    const groupId = params.groupId as string;
    const router = useRouter();
    const [groupName, setGroupName] = useState("Group");
    const [overlap, setOverlap] = useState<number[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const NUM_ROWS = 24;
    const NUM_COLS = 7;
    const rows = [];

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            if(!user){
                router.push("/login");
                return;
            }
            else{
              const fetchGroupName = async () => {
                  const retrievedGroupName = await getGroupName(groupId);
                  setGroupName(retrievedGroupName);
              };

              const fetchOverlap = async () => {
                  const allSlots = await getGroupAvailability(groupId);
                  const result = computeAvailabilityCounts(allSlots);
                  setOverlap(result);
                  setLoading(false);
              };

              const fetchMembers = async () => {
                  const memberData = await getGroupMembers(groupId);
                  if(!memberData){
                      return;
                  }
                  else{
                      setMembers(memberData);
                  }
              };
              
              fetchGroupName();
              fetchOverlap();
              fetchMembers();
            }
        });

        
        return () => unsub();
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

    async function handleLeaveGroup(){
        if(!auth.currentUser){
            return;
        }
        else{
            await leaveGroup(groupId, auth.currentUser.uid);
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
            <td key="time" style={{ fontWeight: "bold", width: "60px" }}>
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
                    height: "20px",
                    width: "60px",
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
            <h1 className="display-4 text-center mb-4">{groupName}</h1>
            
            <div className="d-flex gap-2">
                <button 
                    className="btn btn-outline-secondary"
                    onClick={() => router.push(`/dashboard`)}
                >
                    ← Dashboard
                </button>

                <button 
                    className="btn btn-primary"
                    onClick={() => router.push(`/group/${groupId}/availability`)}
                >
                    Edit Availability
                </button>

                <button className="btn btn-danger" onClick={handleLeaveGroup}>
                    Leave Group
                </button>

          </div>

            <div className="mb-4">
                <h4>Members</h4>

                <ul className="list-group">
                    {members.map((member) => (
                        <li key={member.id} className="list-group-item">
                          {/* Display the user's photo if they have one */ }
                          {member.photoURL && (
                            <img
                              src={member.photoURL}
                              alt={member.name}
                              className="rounded-circle"
                              style={{ width: "30px", height: "30px", marginRight: "10px" }}
                            />
                          )}

                          {/* Display the user's name. If they don't have one saved, then display their email */}
                          {member.name || member.email}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-4 p-3 border rounded container d-flex justify-content-center gap-4">
                <h5>Legend: </h5>

                <div className="d-flex align-items-center gap-3 flex-wrap">

                    <div className="d-flex align-items-center">
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "#EEEEEE",
                            marginRight: "8px",
                            border: "1px solid #ccc"
                          }}
                        />
                        <span>No one available</span>
                    </div>

                    <div className="d-flex align-items-center">
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "rgba(0, 255, 123, 0.5)",
                            marginRight: "8px"
                          }}
                        />
                        <span>Some people available</span>
                    </div>

                    <div className="d-flex align-items-center">
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "rgba(0, 123, 255, 0.5)",
                            marginRight: "8px"
                          }}
                        />
                        <span>Best time (most people available)</span>
                    </div>

                </div>
            </div>

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