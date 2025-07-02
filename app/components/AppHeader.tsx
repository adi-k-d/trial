"use client";
import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavItems from "./NavItems";


export function Navbar() {
 
  
    return (
        <nav className="flex items-center justify-between mx-auto w-full px-14 py-4 bg-white max-sm:px-4">
        <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer ">
                <Image
                    src="/logo.png"
                    alt="logo"
                    width={46}
                    height={44}
                />
            </div>
        </Link>
        <div className="flex items-center gap-8">
                    
            <SignedOut>
                <SignInButton>
                    <button className="border border-black rounded-4xl px-4 py-2.5 text-sm font-semibold flex items-center gap-2 cursor-pointer">Sign In</button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <NavItems/>    
                <UserButton />
            </SignedIn>
        </div>
    </nav>
    );
  }