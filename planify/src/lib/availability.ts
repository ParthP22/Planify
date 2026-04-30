import { db } from "@/lib/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export async function getAvailability(groupId: string, userId: string){
    const ref = doc(db, "groups", groupId, "availability", userId);
    const snapshot = await getDoc(ref);

    if(!snapshot.exists()){
        throw new Error("Availability not found");
    }

    return snapshot.data().slots as number[];
}

export async function saveAvailability(groupId: string, userId: string, slots: number[]){
    const ref = doc(db, "groups", groupId, "availability", userId);

    await setDoc(ref, { slots, updatedAt: serverTimestamp() });

}