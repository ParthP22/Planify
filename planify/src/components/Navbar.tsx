"use client";

import Link from "next/link";

export default function Navbar() {

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

                    <button className="btn btn-outline-danger btn-sm">
                        Logout
                    </button>
                </div>
            </div>
        </nav> 
    );
}