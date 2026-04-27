"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AvailabilityPage() {
    const params = useParams();
    const router = useRouter();
    const groupId = params.groupId as string;

    const [availabilitySlots, setAvailabilitySlots] = useState<number[]>(Array(84).fill(0)); // 7 * 12
    const [loading, setLoading] = useState(true);
    
}