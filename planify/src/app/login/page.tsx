"use client";

import { auth } from "@/lib/firebase";
import { addUser } from "@/lib/users";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    const loginData = await signInWithPopup(auth, provider);
    const user = loginData.user;
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        addUser(user);
      }
    });

    router.push("/dashboard");
    return () => unsubscribe();
  };

  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-4 display-3">Planify</h1>

      <button className="btn btn-primary" onClick={signIn}>
        Sign in with Google
      </button>
    </div>
  );
}