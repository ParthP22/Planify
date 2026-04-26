"use client";

import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Listen for authentication state changes
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      }
    });

    // Clean up the listener on unmount
    return () => unsub();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>
      <p>You are logged in!</p>
    </div>
  );
}