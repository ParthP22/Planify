import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getAvailability(groupId: string, userId: string){
    const ref = doc(db, "groups", groupId, "availability", userId);
    const snapshot = await getDoc(ref);

    if(!snapshot.exists()){
        throw new Error("Availability not found");
    }

    return snapshot.data().slots as number[]
}