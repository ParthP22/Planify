"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function GroupPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const router = useRouter();



  return (
    <div className="container mt-5">
      <h1>Group</h1>
      <p>Group ID: {groupId}</p>
      
    </div>

    
  );
}