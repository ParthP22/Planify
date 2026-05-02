"use client";

import { setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "firebase/auth";

export async function addUser(user: User){
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    // Check if the user already exists before trying
    // to add them to the database. This can prevent
    // overwriting existing user data.
    if(userSnapshot.exists()){
        return;
    }

    await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        name: user.displayName || "Anonymous",
        email: user.email,
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
    });
}