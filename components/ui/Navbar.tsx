
import logo from "../../public/assets/logo.png";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import UserMenu from "./UserMenu";
import { Button } from "./button";
import { PenBox } from "lucide-react";
import Loader from '../ui/Loader'
import { checkUser } from "@/lib/checkUser";
import { ModeToggle } from "./theme-toggle";

const Navbar = async () => {
  await checkUser();


  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex justify-between items-center w-[90%] md:w-[70%] lg:w-[60%] glass rounded-full px-6 py-3 border border-white/20 shadow-2xl shadow-primary/10">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-all" />
            <Image
              src={logo}
              width={40}
              height={40}
              alt="Zora logo"
              className="relative max-sm:size-8 object-contain"
            />
          </div>
          <p className="text-2xl font-bold text-gradient pb-1">Zora</p>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/project/create">
            <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all text-primary-foreground border-0 rounded-full px-6">
              <PenBox size={18} />
              <span className="hidden md:inline">Create Project</span>
            </Button>
          </Link>
          
          <div className="flex items-center gap-3">
            <ModeToggle />
            <SignedOut>
              <SignInButton forceRedirectUrl="/onboarding">
                  <Button variant="outline" className="glass hover:bg-secondary rounded-full">
                      Sign In
                  </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserMenu />
            </SignedIn>
          </div>
        </div>
      </nav>
      <Loader/>
    </>
  );
};

export default Navbar;
