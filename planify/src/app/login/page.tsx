"use client";

import { auth } from "@/lib/firebase";
import { addUser } from "@/lib/users";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  // Create router to control sending the user to other pages.
  const router = useRouter();

  // Asynchronous function to handle sign-in/sign-up via Google
  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    const loginData = await signInWithPopup(auth, provider);
    const user = loginData.user;

    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        addUser(user);
      }
    });

    router.push("/dashboard");

    // Clean up the listener on unmount to prevent memory leaks
    return () => unsubscribe();
  };

  return (
    
    <div className="page-bg d-flex flex-column justify-content-center align-items-center text-center vh-100">
      <div className="shadow login-card-bg py-4 px-5 border border-0 rounded-3 d-flex flex-column justify-content center align-items-center text-center ">
        <h1 className="display-1 text-white fw-bold mb-3">
          Planify
        </h1>

        <img src="/calendar.png" height="300px" width="300px"></img>

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
          <img src="google-logo.png" height="20px" width="20px"></img>

          <span className="ms-2 fw-semibold">
            Sign in with Google
          </span>
        </button>
      </div>
    </div>
  );
}