"use client";

import { computeAvailabilityCountsAction, getGroupAvailabilityAction } from "@/app/actions/groups";
// import { computeAvailabilityCounts, getGroupAvailability } from "@/lib/availability";
// import { getGroupMembers, getGroupName, getInviteCode, leaveGroup, verifyMembership } from "@/lib/groups";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// import { auth } from "@/lib/firebase";

export default function GroupPage() {
    // React hook to access the parameters in the URL.
    // This page will be using the groupId parameter that is
    // shown in the URL.
    const params = useParams();

    // Obtain the groupId parameter from the URL
    const groupId = params.groupId as string;

    // Create router to control sending the user to other pages.
    const router = useRouter();

    // State for the current group's name.
    const [groupName, setGroupName] = useState("Group");

    // Store the overlap between everyone's availability schedules in the group.
    const [overlap, setOverlap] = useState<number[]>([]);

    // Store an array of all the members of the groups.
    const [members, setMembers] = useState<any[]>([]);

    // Loading state to indicate if the page is loading.
    const [loading, setLoading] = useState(true);

    // Invite code state to store the invite code of the state
    const [inviteCode, setInviteCode] = useState("");

    // The availability grid will be 24 x 7,
    // for 24 hours and 7 days.
    const NUM_ROWS = 24;
    const NUM_COLS = 7;

    // Store the rows of the grid in this array and they will
    // be displayed as a table.
    const rows = [];

    // When the page loads or whenever the groupId changes, perform these calls
    useEffect(() => {
        // // Listen for authentication state changes
        // const unsub = auth.onAuthStateChanged((user) => {
        //     // If the user is not logged in, then redirect
        //     // immediately to the login page
        //     if(!user){
        //         router.push("/login");
        //         return;
        //     }
        //     else{
        //         // Retrieve the current group name based on groupId
        //         const fetchGroupName = async () => {
        //             const retrievedGroupName = await getGroupName(groupId);
        //             setGroupName(retrievedGroupName);
        //         };
                
        //         // Retrieve the current overlap in schedules based on groupId
        //         const fetchOverlap = async () => {
        //             const allSlots = await getGroupAvailability(groupId);
        //             const result = computeAvailabilityCounts(allSlots);
        //             setOverlap(result);
        //             setLoading(false);
        //         };
                
        //         // Retrieve the current members of the group
        //         const fetchMembers = async () => {
        //             const memberData = await getGroupMembers(groupId);
        //             if(!memberData){
        //                 return;
        //             }
        //             else{
        //                 setMembers(memberData);
        //             }
        //         };

        //         // Retrieve the invite code based on the groupId
        //         const fetchInviteCode = async () => {
        //             const inviteCode = await getInviteCode(groupId);
        //             if(!inviteCode){
        //                 return;
        //             }
        //             else{
        //                 setInviteCode(inviteCode);
        //             }
        //         };

        //         // Verify that the member is indeed a member of this group
        //         const verifyMember = async () => {
        //             console.log(user.uid);
        //             const isMember = await verifyMembership(groupId, user.uid);
        //             if(!isMember){
        //                 alert("You are not a member of this group!");
        //                 router.push("/dashboard");
        //             }
        //         };
                
        //         verifyMember();
        //         fetchGroupName();
        //         fetchInviteCode();
        //         fetchOverlap();
        //         fetchMembers();
        //     }
        // });

        const fetchOverlap = async () => {
            const allSlots = await getGroupAvailabilityAction(groupId);
            const result = await computeAvailabilityCountsAction(allSlots);
            setOverlap(result);
            setLoading(false);
        };


        fetchOverlap();

        // // Unmount the auth listener
        // return () => unsub();


    }, [groupId]);

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

    // Function for the button to handle leaving a group
    async function handleLeaveGroup(){
        // const user = auth.currentUser;
        // // If the user is not logged in, then do not do anything.
        // if(!user){
        //     return;
        // }
        // else{
        //     // If the user leaves, then return them to the dashboard 
        //     // and then remove the user from the database.
        //     await leaveGroup(groupId, user.uid);
        //     router.push("/dashboard");
        // }
        
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

    // Show loading state if the page is still loading
    if(loading){
        return (
            <div className="page-bg text-light">
                <h2 className="text-center">Loading... </h2>
            </div>
        );
    }

    return (
        <div className="page-bg text-light pb-1">
            <div className="container pt-5">
                <h1 className="display-4 text-center mb-4">{groupName}</h1>
                <h4 className="text-center mb-4">Invite Code: {inviteCode}</h4>
                <div className="row">
                    <div className="mb-4 col-md-2">

                        <button 
                            className="btn btn-secondary mb-3"
                            onClick={() => router.push(`/dashboard`)}
                        >
                            ← Dashboard
                        </button>


                        {/* Members List */}
                        <h4 className="text-center">Members</h4>
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
                    
                    <div className="col-md-8">
                        <div className="d-flex justify-content-between">

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

                        {/* Legend section */}
                        <div className="mt-4 p-3 bg-light text-dark border rounded-top container d-flex justify-content-center gap-4">
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
                                        backgroundColor: "rgba(0, 123, 255, 0.5)",
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
                                        backgroundColor: "rgba(0, 255, 123, 0.5)",
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
                </div>
            </div>
        </div>
      
    );
}