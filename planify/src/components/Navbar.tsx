"use client";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {

    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    if(pathname === "/login"){
        return null;
    }

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" href="/dashboard">
                    Planify
                </Link>
                <div className="d-flex align-items-center gap-3">
                    <Link className="nav-link" href="/dashboard">
                        Dashboard
                    </Link>

                    <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav> 
    );
}
