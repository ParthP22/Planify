"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
// import { signOut, User } from "firebase/auth";
import { signOut } from "next-auth/react";
import { User } from "next-auth";
import { auth } from "@/auth";
import { useSession } from "next-auth/react";
import { signOutUser } from "@/actions/auth-actions";

export default function Navbar() {
    // Create router to control sending the user to other pages.
    const router = useRouter();

    // Use the URL that this component is on
    const pathname = usePathname();

    const {data: session } = useSession();

    const user = session?.user;

    // Function to handle the sign-out operation when
    // clicking the Log Out button
    const handleLogout = async () => {
        await signOutUser();
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
                {user && user.image && (
                    <img
                        src={user.image}
                        alt="User"
                        className="rounded-circle"
                        style={{ width: "30px", height: "30px" }}
                    />
                )}

                {/* Display the user's name from their Google account */}
                {user && (
                    <span className="text-light">
                        {user.name}
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
