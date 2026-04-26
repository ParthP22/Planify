"use client";

import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);

    router.push("/dashboard");
  };

  return (
    <div>
      <h1>Planify Login</h1>

      <button onClick={signIn}>
        Sign in with Google
      </button>
    </div>
  );
}