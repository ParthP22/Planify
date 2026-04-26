"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { createGroup, joinGroup, getUserGroups } from "@/lib/groups";

export default function Dashboard() {
    const [groups, setGroups] = useState<any[]>([]);
    const [groupName, setGroupName] = useState("");
    const [result, setResult] = useState<any>(null);
    const [inviteCode, setInviteCode] = useState("");
    
    const router = useRouter();

    useEffect(() => {
        
            // Listen for authentication state changes
            const unsub = auth.onAuthStateChanged((user) => {
                // If the user is not logged in, redirect to the login page
                if (!user) {
                    router.push("/login");
                }
                else{
                    loadGroups();
                }
            });
            
            // Clean up the listener on unmount
            return () => unsub();
    }, []);

    const handleCreateGroup = async () => {
        const user = auth.currentUser;

        // If the user is not logged in, we return.
        // Ideally, this should never happen, since this
        // case is already handled in the useEffect 
        // function above, but it's good to be safe.
        if(!user){
            return;
        }

        const res = await createGroup(groupName, user.uid);
        setResult(res);
        loadGroups();
    }

    const handleJoin = async () => {
        const user = auth.currentUser;
        if(!user){
            return;
        }

        try{
            await joinGroup(inviteCode, user.uid);
            alert("Joined group!");
        }
        catch (error: any){
            alert(error.message);
        }

        loadGroups();
    }

    const loadGroups = async () => {
        const user = auth.currentUser;
        if(!user){
            return;
        }

        const data = await getUserGroups(user.uid);
        setGroups(data);
    }

    return (
        <div className="container mt-5">
            <h1>Dashboard</h1>
            <p>You are logged in!</p>

            <h2>Create Group</h2>

            <input
                className="form-control my-2"
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
            />

            <button className="btn btn-primary" onClick={handleCreateGroup}>
                Create Group
            </button>

            {result && (
                <div className="alert alert-success mt-3">
                <div>Group Created!</div>
                <div><b>Invite Code:</b> {result.inviteCode}</div>
                </div>
            )}

            <div className="mt-5">

                <h2>Join Group</h2>

                <input
                    className="form-control my-2"
                    placeholder="Enter invite code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                />

                <button className="btn btn-success" onClick={handleJoin}>
                    Join Group
                </button>
            </div>

            <h3>Your Groups</h3>

            <div className="row">
                {groups.map((group) => (
                    <div className="col-md-4" key={group.id}>
                        <div className="card p-3 mb-3">
                            <h5>{group.name}</h5>
                            <p className="text-muted">Code: {group.inviteCode}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}