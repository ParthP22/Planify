"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GroupPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const router = useRouter();
  const [overlap, setOverlap] = useState<number[]>([]);



  return (
    <div className="container mt-5">
      <h1>Group</h1>
      <p>Group ID: {groupId}</p>
      
      <button onClick={() => router.push(`/group/${groupId}/availability`)}>
        Edit My Availability
      </button>
    </div>

    
  );
}