"use client";

import { setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "firebase/auth";

// Add the user into the users collection in the database when they sign-up
export async function addUser(user: User){
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    // Check if the user already exists before trying
    // to add them to the database. This can prevent
    // overwriting existing user data.
    if(userSnapshot.exists()){
        return;
    }
    else{
        // Store the following object in the database
        await setDoc(userRef, {
            userId: user.uid,
            name: user.displayName || "Anonymous",
            email: user.email,
            photoURL: user.photoURL || null,
            createdAt: serverTimestamp(),
        });
    }
}