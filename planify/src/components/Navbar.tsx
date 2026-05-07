"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { User } from "firebase/auth";

export default function Navbar() {

    const router = useRouter();
    const pathname = usePathname();

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        return () => unsub();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

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

                {user && user.photoURL && (
                    <img
                        src={user.photoURL}
                        alt="User"
                        className="rounded-circle"
                        style={{ width: "30px", height: "30px" }}
                    />
                )}

                {user && (
                    <span className="text-light">
                        {user.displayName}
                    </span>
                )}

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
