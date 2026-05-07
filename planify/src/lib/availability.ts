import { db } from "@/lib/firebase";
import { 
    doc, 
    getDoc, 
    serverTimestamp, 
    setDoc,
    getDocs,
    collection
} from "firebase/firestore";

// Retrieve the availability schedule for the current user for the selected group
export async function getAvailability(groupId: string, userId: string){
    const ref = doc(db, "groups", groupId, "availability", userId);
    const snapshot = await getDoc(ref);

    if(!snapshot.exists()){
        return null;
    }

    return snapshot.data().slots as number[];
}

// Update the availability schedule for the current user for the selected group
export async function saveAvailability(groupId: string, userId: string, slots: number[]){
    const ref = doc(db, "groups", groupId, "availability", userId);

    await setDoc(ref, { slots, updatedAt: serverTimestamp() });

}

// Retrieve the availability schedules of all the group members and push it into
// an array to be processed later.
export async function getGroupAvailability(groupId: string){
    const snapshot = await getDocs(collection(db, "groups", groupId, "availability"));

    if(snapshot.empty){
        return [];
    }

    const allSlots: number[][] = [];

    // Take all the documents of the availability schedules retrieved from
    // the database and push it into an array.
    snapshot.forEach((doc) => {
        const data = doc.data();

        if(data.slots){
            allSlots.push(data.slots);
        }
    });

    return allSlots;
}

// Compute the strict overlap between the availability schedules of
// all the group members by using logical AND operator
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

// Compute for each time slot in the schedule the number of people
// in the group that are available at that time slot.
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