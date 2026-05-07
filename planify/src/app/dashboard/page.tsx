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
                    loadGroups(user.uid);
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

        if(!(groupName.trim())){
            alert("Please enter a group name.");
            return;
        }

        const res = await createGroup(groupName.trim(), user.uid);
        setResult(res);
        loadGroups(user.uid);
    }

    const handleJoin = async () => {
        const user = auth.currentUser;
        if(!user){
            return;
        }

        if(!inviteCode){
            alert("Please enter the invite code.");
            return;
        }

        try{
            await joinGroup(inviteCode, user.uid);
            alert("Joined group!");
        }
        catch (error: any){
            alert(error.message);
        }

        loadGroups(user.uid);
    }

    const loadGroups = async (userId: string) => {
        if(!userId){
            return;
        }

        const data = await getUserGroups(userId);
        setGroups(data);
    }

    return (
        <div className="container mt-5 w-50">
            <div className="container mt-5 mw-100 shadow p-4 rounded">
                <h1 className="display-4 text-center mb-4">Dashboard</h1>
                <p>You are logged in!</p>

                <h2>Create Group</h2>

                <input
                    className="form-control my-2"
                    placeholder="Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />

                <button className="btn bg-indigo w-100" onClick={handleCreateGroup}>
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

                    <button className="btn btn-success w-100" onClick={handleJoin}>
                        Join Group
                    </button>
                </div>
            </div>

            <div className="container mt-5 mb-5 mw-100 shadow p-4 rounded">
                <h3 className="display-5 text-center mb-4">Your Groups</h3>

                <div className="row">
                    {groups.map((group) => (
                        <div className="col-md-4" key={group.id}>
                            <div
                                className="card p-3 mb-3"
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
    );
}