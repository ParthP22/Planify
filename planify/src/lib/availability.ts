import { db } from "@/lib/firebase";
import { 
    doc, 
    getDoc, 
    serverTimestamp, 
    setDoc,
    getDocs,
    collection
} from "firebase/firestore";

export async function getAvailability(groupId: string, userId: string){
    const ref = doc(db, "groups", groupId, "availability", userId);
    const snapshot = await getDoc(ref);

    if(!snapshot.exists()){
        return null;
    }

    return snapshot.data().slots as number[];
}

export async function saveAvailability(groupId: string, userId: string, slots: number[]){
    const ref = doc(db, "groups", groupId, "availability", userId);

    await setDoc(ref, { slots, updatedAt: serverTimestamp() });

}

export async function getGroupAvailability(groupId: string){
    const snapshot = await getDocs(collection(db, "groups", groupId, "availability"));

    if(snapshot.empty){
        return [];
    }

    const allSlots: number[][] = [];

    snapshot.forEach((doc) => {
        const data = doc.data();

        if(data.slots){
            allSlots.push(data.slots);
        }
    });

    return allSlots;
}

export function computeStrictOverlap(allSlots: number[][]){
    if(allSlots.length === 0){
        return [];
    }

    const TOTAL_SLOTS = allSlots[0].length;
    const result = Array(TOTAL_SLOTS).fill(1);

    for(const userSlots of allSlots){
        for(let i = 0; i < TOTAL_SLOTS; i++){
            result[i] = result[i] & userSlots[i];
        }
    }

    return result;
}

export function computeAvailabilityCounts(allSlots: number[][]){
    if(allSlots.length === 0){
        return [];
    }

    const TOTAL_SLOTS = allSlots[0].length;
    const counts = Array(TOTAL_SLOTS).fill(0);

    for(const userSlots of allSlots){
        for(let i = 0; i < TOTAL_SLOTS; i++){
            counts[i] += userSlots[i];
        }
    }

    return counts;
}