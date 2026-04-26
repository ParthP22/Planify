"use client";

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { generateInviteCode } from "../utils/groups/inviteCode";

export async function createGroup(name: string, userId: string) {
  const inviteCode = generateInviteCode();

  const docRef = await addDoc(collection(db, "groups"), {
    name,
    createdBy: userId,
    inviteCode,
    createdAt: serverTimestamp(),
  });

  return {
    groupId: docRef.id,
    inviteCode,
  };
}