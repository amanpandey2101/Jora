
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

const Navbar = async () => {
  await checkUser();


  return (
    <div>
    <nav className="flex justify-between items-center fixed z-50 w-full bg-[#FCBF49] px-6  lg:px-10">
      {/* Logo Section */}
      <Link href="/" className="flex items-center gap-1">
        <Image
          src={logo}
          width={60}
          height={60}
          alt="Zora logo"
          className="max-sm:size-10"
        />
        <p className="text-[36px] font-extrabold text-black pb-3">Zora</p>
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/project/create">
          <Button variant="destructive" className="flex items-center gap-2">
            <PenBox size={18} />
            <span className="hidden md:inline">Create Project</span>
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </div>
    </nav>
    <Loader/>
    </div>

  );
};

export default Navbar;
