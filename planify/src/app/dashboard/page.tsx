"use client";

import { useState, useEffect } from "react";
// import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { createGroupAction, getUserGroupsAction, joinGroupAction } from "../actions/groups";
// import { createGroup, joinGroup, getUserGroups } from "@/lib/groups";

export default function Dashboard() {
    // Groups state to store all the groups that the user
    // is apart of.
    const [groups, setGroups] = useState<any[]>([]);

    // The name of the group that the user is typing when creating
    // a new group. 
    const [groupName, setGroupName] = useState("");

    // Store the result from a newly created group.
    const [result, setResult] = useState<any>(null);

    // The name of the invite code that the user is typing when
    // attempting to join a group.
    const [inviteCode, setInviteCode] = useState("");
    
    // Initialize router to be able to perform redirects.
    const router = useRouter();

    useEffect(() => {
        
            // Listen for authentication state changes
            // const unsub = auth.onAuthStateChanged((user) => {
            //     // If the user is not logged in, redirect to the login page
            //     if (!user) {
            //         router.push("/login");
            //     }
            //     else{
            //         loadGroups(user.uid);
            //     }
            // });
            
            // Clean up the listener on unmount
            // return () => unsub();

            loadGroups();
    }, []);

    // Function for the button to create a new group for the user.
    const handleCreateGroup = async () => {
        // const user = auth.currentUser;

        // If the user is not logged in, we return.
        // Ideally, this should never happen, since this
        // case is already handled in the useEffect 
        // function above, but it's good to be safe.
        // if(!user){
        //     return;
        // }

        // Remove all trailing and leading whitespace of the group's name.
        // If the string is empty, then alert the user.
        if(!(groupName.trim())){
            alert("Please enter a group name.");
            return;
        }

        // Store the contents of the Promise
        // const res = await createGroup(groupName.trim(), user.uid);

        const ret = await createGroupAction(groupName.trim());
        setResult(ret);

        // Update the results state with the content of the new group.
        // setResult(res);

        // Reload the groups section
        // loadGroups(user.uid);
    }

    // Function for the button to handle joining another group
    const handleJoin = async () => {

        // Check to be sure that the user is indeed logged in.
        // const user = auth.currentUser;
        // if(!user){
        //     return;
        // }

        // Removing all leading and trailing whitespace from the
        // invite code. If the string is empty, alert the user.
        if(!(inviteCode.trim())){
            alert("Please enter the invite code.");
            return;
        }

        try{
            // Try joining the user into the group
            // const joinStatus = await joinGroup(inviteCode, user.uid);

            // If joinStatus is false, then the user is already in the group.
            // if(!joinStatus){
            //     alert("You are already in this group");
            // }
            // else{
            //     alert("Joined group!");
            // }

            const joinStatus = await joinGroupAction(inviteCode.trim());

            if(!joinStatus){
                alert("You are already in this group.");
            }
            else{
                alert("Joined group!");
            }

        }
        catch (error: any){
            // Catch and display any error messages
            alert(error.message);
        }

        // Reload the groups again
        // loadGroups(user.uid);

        loadGroups();
    }

    // This function that updates the groups state and reloads
    // the groups section of the dashboard for the user.
    const loadGroups = async () => {

        const data = await getUserGroupsAction();
        setGroups(data);
        // const data = await getUserGroups(userId);
        // setGroups(data);
    }

    return (
        <div className="page-bg">
            <div className="container pt-5 w-50 pb-5">
                <div className="container white-card mt-5 mw-100 shadow p-4 rounded">
                    <h1 className="display-2 text-center mb-4">Dashboard</h1>

                    <h2>Create Group</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateGroup();
                    }}>
                        <input
                            className="form-control my-2"
                            placeholder="Group Name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />

                        <button className="btn btn-bg-navy-blue w-100" type="submit">
                            Create Group
                        </button>
                    </form>

                    {result && (
                        <div className="alert alert-success mt-3">
                        <div>Group Created!</div>
                        <div><b>Invite Code:</b> {result.inviteCode}</div>
                        </div>
                    )}

                    <div className="mt-5">

                        <h2>Join Group</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleJoin();
                        }}>
                            <input
                                className="form-control my-2"
                                placeholder="Enter invite code"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                            />
                            <button type="submit" className="btn btn-success w-100">
                                Join Group
                            </button>
                        </form>
                    </div>
                </div>

                <div className="container white-card mt-5 mw-100 shadow p-4 rounded">
                    <h3 className="display-6 text-center mb-4">Your Groups</h3>

                    <div className="row">
                        {/* Map each group object in the groups state to a clickable card to be displayed */}
                        {groups.map((group) => (
                            <div className="col-md-4" key={group.id}>
                                <div
                                    className="card group-card p-3 mb-3"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => router.push(`/group/${group.id}`)}
                                >
                                    <h5>{group.name}</h5>
                                    <p className="text-muted">Code: {group.inviteCode}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}