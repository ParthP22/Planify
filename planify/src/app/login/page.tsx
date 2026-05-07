"use client";

import { auth } from "@/lib/firebase";
import { addUser } from "@/lib/users";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

      <p className="mt-3 text-lg text-gray-600">
        Coordinate schedules with your group.
      </p>


      <button className="btn btn-light shadow-sm rounded-pill w-25 gap-3 px-6 py-3" onClick={signIn}
      >
          <Image
            src="/google-logo.png"
            alt="Google Logo"
            width={20}
            height={20}
          />
          <span>    Sign in with Google</span>
      </button>
    </div>
  );
}