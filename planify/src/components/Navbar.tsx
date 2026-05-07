"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { User } from "firebase/auth";

export default function Navbar() {
    // Create router to control sending the user to other pages.
    const router = useRouter();

    // Use the URL that this component is on
    const pathname = usePathname();

    // Store the current user in a state
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        // Listen for authentication state changes
        const unsub = auth.onAuthStateChanged((user) => {
            // If the user who is logged in changes, then update the user state
            setUser(user);
        });

        // Unmount the auth listener
        return () => unsub();
    }, []);

    // Function to handle the sign-out operation when
    // clicking the Log Out button
    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    // Don't render the Navbar on the login page
    if(pathname === "/login"){
        return null;
    }

    return (
        <nav className="navbar nav-bg px-3">
            <div className="d-flex align-items-center gap-3">
                <Link className="navbar-brand text-light" href="/dashboard">
                    <img src="/calendar.png" height="30px" width="30px"></img>
                    
                    Planify
                </Link>
                <Link className="nav-link text-light" href="/dashboard">
                    Dashboard
                </Link>
            </div>

            <div className="d-flex align-items-center gap-3 ms-auto">

                {/* Display the user's profile picture from their Google account */}
                {user && user.photoURL && (
                    <img
                        src={user.photoURL}
                        alt="User"
                        className="rounded-circle"
                        style={{ width: "30px", height: "30px" }}
                    />
                )}

                {/* Display the user's name from their Google account */}
                {user && (
                    <span className="text-light">
                        {user.displayName}
                    </span>
                )}

                {/* Logout button */}
                {user && (
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}
