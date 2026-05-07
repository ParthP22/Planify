"use client";

import { db } from "@/lib/firebase";
import { 
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    doc,
    getDocs,
    setDoc,
    getDoc,
    deleteDoc,
} from "firebase/firestore";
import { generateInviteCode } from "../utils/groups/inviteCode";

// Create a new group based on the name provided by the user who
// is creating it.
export async function createGroup(name: string, userId: string) {
    // Generate a new 6-digit invite code
    const inviteCode = generateInviteCode();

    // Retrieve the reference for the document from the Firestore database
    const docRef = await addDoc(collection(db, "groups"), {
        name,
        createdBy: userId,
        inviteCode,
        createdAt: serverTimestamp(),
    });

    // Call the joinGroup function (defined below) so that the creator
    // of this group is also added in.
    await joinGroup(inviteCode, userId);

    return {
        groupId: docRef.id,
        inviteCode,
    };
}

// Given an invite code, add the current user to the group
export async function joinGroup(inviteCode: string, userId: string){
    // Fetch the reference to the group collection
    const groupsRef = collection(db, "groups");
    
    // Query the document from the group collection with the given invite code.
    const q = query(groupsRef, where("inviteCode", "==", inviteCode));
    
    // Retrieve the documents from the query
    const snapshot = await getDocs(q);

    // If the snapshot is empty, then the group does not exist
    if(snapshot.empty){
        throw new Error("Group not found");
    }

    // Get the actual document of the group itself
    const groupDoc = snapshot.docs[0];

    // Get the id of the group
    const groupId = groupDoc.id;

    // Retrieve the member from the group to see if they exist already.
    const memberRef = doc(db, "groups", groupId, "members", userId);
    const memberSnapshot = await getDoc(memberRef);

    // Check if the member already exists in this group
    if(memberSnapshot.exists()){
        return false;
    }
    else{
        // Add user to members subcollection in the group, which means
        // the member has joined the group.
        // The name of the members doc is the userId of the member who is joining.
        await setDoc(doc(db,"groups", groupId, "members", userId), {
                role: "member",
                joinedAt: serverTimestamp(),
            }
        );
        return true;
    }
}

// Retrieve all the groups that the user is a part of
export async function getUserGroups(userId: string){
    const groupsRef = collection(db, "groups");
    const groupsSnapshot = await getDocs(groupsRef);

    // We will store all groups that the user is a part of
    // in this array.
    const userGroups: any[] = [];
    
    // Iterate over all the groups stored in the database
    for(const groupDoc of groupsSnapshot.docs){
        // For each iteration, obtain all the members that are
        // a part of the group.
        const membersSnap = await getDocs(
            collection(db, "groups", groupDoc.id, "members")
        );

        // Find if the user's ID matches the ID of a member in the group.
        const isMember = membersSnap.docs.some((doc) => doc.id === userId);

        // If the ID's match, then that implies the user is in this group,
        // so we push this group into an array.
        if(isMember){
            userGroups.push({
                id: groupDoc.id,
                ...groupDoc.data(),
            })
        }
    }

    // Return all the groups that the user is in.
    return userGroups;
}

// Obtain all the members of a given group.
export async function getGroupMembers(groupId: string){
    const membersRef = collection(db, "groups", groupId, "members");
    const membersSnapshot = await getDocs(membersRef);

    if(membersSnapshot.empty){
        return [];
    }  

    // We will store all the members of the group in this array.
    const members = [];

    // Iterate over each member in this group
    for(const memberDoc of membersSnapshot.docs){
        // Obtain the user's ID from the document in the members collection.
        const userId = memberDoc.id;

        // Use the user's ID to access the users collection and get more
        // information on the user.
        const userSnapshot = await getDoc(doc(db, "users", userId));

        // We will store the userId, as well as the rest of the user data by
        // using the spread operator, as an Object and push it into the members
        // array to be processed later.
        if(userSnapshot.exists()){
            members.push({
                id: userId,
                ...userSnapshot.data(),
            });
        }
        else{
            // If no data on the user exists, then we simply push an object
            // consisting of the user's ID and their name will be "Unknown User"
            members.push({
                id: userId,
                name: "Unknown User",
            });
        }
    }

    return members;
}

// Obtain the name of the group
export async function getGroupName(groupId: string){
    const groupRef = doc(db, "groups", groupId);
    const groupSnapshot = await getDoc(groupRef);

    if(!groupSnapshot.exists()){
        return null;
    }
    else{
        const groupData = groupSnapshot.data();
        const groupName = groupData.name;
        return groupName;
    }
}

// Remove the member from a group in the database
export async function leaveGroup(groupId: string, memberId: string){
    // Fetch the member's availability schedule from the group
    const availabilityRef = doc(db, "groups", groupId, "availability", memberId);
    const availabilitySnapshot = await getDoc(availabilityRef);

    if(availabilitySnapshot.exists()){
        // Remove the member's availability schedule from the group
        await deleteDoc(availabilityRef);
    }

    // Fetch the member from the group.
    const memberRef = doc(db, "groups", groupId, "members", memberId);
    const memberSnapshot = await getDoc(memberRef);

    if(!memberSnapshot.exists()){
        return null;
    }

    // Remove the member from the group if they left.
    await deleteDoc(memberRef);


    // Check if the group is empty.
    const membersRef = collection(db, "groups", groupId, "members");
    const membersSnapshot = await getDocs(membersRef);

    // If there are no more members in the group, then delete the group.
    if(membersSnapshot.empty){
        const groupRef = doc(db, "groups", groupId);
        await deleteDoc(groupRef);
    }
}

// Check if the user is indeed a member of the group (in order to prevent
// users from accessing groups that they are not apart of).
export async function verifyMembership(groupId: string, memberId: string){
    const memberRef = doc(db, "groups", groupId, "members", memberId);
    const memberSnapshot = await getDoc(memberRef);

    // If the user exists in the group, then they are a true member.
    if(memberSnapshot.exists()){
        return true;
    }
    else{
        return false;
    }
}

// Obtain the invite code of the given group from the database.
export async function getInviteCode(groupId: string){
    const groupRef = doc(db, "groups", groupId);
    const groupSnapshot = await getDoc(groupRef);

    if(!groupSnapshot.exists()){
        return null;
    }

    const groupData = groupSnapshot.data();

    return groupData.inviteCode as string;
}