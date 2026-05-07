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
    <div className="page-bg d-flex flex-column justify-content-center align-items-center text-center vh-100">
      <h1 className="display-1 text-white fw-bold mb-3">
        Planify
      </h1>

      <p className="fs-3 text-light mb-5">
        Coordinate schedules with your group.
      </p>

      <p className="text-light mb-4">
        Start by logging in with Google
      </p>

      <button
        className="btn btn-light shadow-sm rounded-3 px-4 py-3 d-flex align-items-center"
        onClick={signIn}
      >
        <Image
          src="/google-logo.png"
          alt="Google Logo"
          width={20}
          height={20}
        />

        <span className="ms-2 fw-semibold">
          Sign in with Google
        </span>
      </button>
    </div>
  );
}