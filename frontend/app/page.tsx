import Link from "next/link";
import Image from "next/image";
import "../app/styles/animations.css";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <ul className="background">
        {Array.from({ length: 18 }).map((_, idx) => (
          <li key={idx}></li>
        ))}
      </ul>
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-8 md:w-2/6 md:px-20"
          style={{ backgroundColor: "#ffffff" }}
        >
          <p
            className="text-xl text-gray-800 md:text-3xl"
            style={{ fontFamily: "'Lusitana', serif", textAlign: "center", lineHeight: '1.2' }} // Adjusted line-height here
          >
            <Image
              src="/DS_logo2.png"
              alt="Data Chain Logo"
              width={150}
              height={100}
              priority
              style={{ margin: "0 auto" }}
            />
            <span className="block mt-6 mb-4" style={{ fontFamily: "Helvetica",  fontSize: "20px"}}>
              Welcome to DataChain, your starting point for easy access to data.
            </span>
          </p>
          <SignedIn>
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-5 rounded-lg bg-blue-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
              <span>Continue</span>
            </Link>
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className="flex items-center justify-center gap-5 rounded-lg bg-blue-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
              <span>Sign In</span>
            </Link>
          </SignedOut>
        </div>
      </div>
    </main>
  );
}
