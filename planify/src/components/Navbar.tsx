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
        <nav className="navbar bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" href="/dashboard">
                    Planify
                </Link>

                <Link className="nav-link" href="/dashboard">
                        Dashboard
                    </Link>
                <div className="d-flex align-items-center gap-3">

                    {user && (
                        <span className="text-muted">
                            {user.displayName}
                        </span>
                    )}


                    {user && (
                        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav> 
    );
}
