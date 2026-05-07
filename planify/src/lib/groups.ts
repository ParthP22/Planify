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

export async function createGroup(name: string, userId: string) {
  const inviteCode = generateInviteCode();

  const docRef = await addDoc(collection(db, "groups"), {
    name,
    createdBy: userId,
    inviteCode,
    createdAt: serverTimestamp(),
  });

  await joinGroup(inviteCode, userId);

  return {
    groupId: docRef.id,
    inviteCode,
  };
}


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

    // Add user to members subcollection in the group, which means
    // the member has joined the group.
    // The name of the members doc is the userId of the member who is joining.
    await setDoc(doc(db,"groups", groupId, "members", userId), {
            role: "member",
            joinedAt: serverTimestamp(),
        }
    );
}

export async function getUserGroups(userId: string){
    const groupsSnapshot = await getDocs(collection(db,"groups"));

    const userGroups: any[] = [];

    for(const groupDoc of groupsSnapshot.docs){
        const membersSnap = await getDocs(
            collection(db, "groups", groupDoc.id, "members")
        );

        const isMember = membersSnap.docs.some((doc) => doc.id === userId);

        if(isMember){
            userGroups.push({
                id: groupDoc.id,
                ...groupDoc.data(),
            })
        }
    }

    return userGroups;
}

export async function getGroupMembers(groupId: string){
    const membersRef = collection(db, "groups", groupId, "members");
    const membersSnapshot = await getDocs(membersRef);

    if(membersSnapshot.empty){
        return [];
    }

    const members = [];

    for(const memberDoc of membersSnapshot.docs){
        const userId = memberDoc.id;

        const userSnapshot = await getDoc(doc(db, "users", userId));
        console.log(userSnapshot.data());

        if(userSnapshot.exists()){
            members.push({
                id: userId,
                ...userSnapshot.data(),
            });
        }
        else{
            members.push({
                id: userId,
                name: "Unknown User",
            });
        }
    }

    return members;
}

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

export async function leaveGroup(groupId: string, memberId: string){
    // Fetch the member's availability schedule from the group
    const availabilityRef = doc(db, "groups", groupId, "availability", memberId);
    const availabilitySnapshot = await getDoc(availabilityRef);

    if(!availabilitySnapshot.exists()){
        return null;
    }

    // Remove the member's availability schedule from the group
    await deleteDoc(availabilityRef);

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

export async function verifyMembership(groupId: string, memberId: string){
    const memberRef = doc(db, "groups", groupId, "members", memberId);
    const memberSnapshot = await getDoc(memberRef);

    if(memberSnapshot.exists()){
        return true;
    }
    else{
        return false;
    }
}