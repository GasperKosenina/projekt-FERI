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
      {/* <div className="mt-4 flex grow flex-col gap-4 md:flex-row"> */}
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-3 py-10 md:w-2/5 md:px-20"
          style={{ backgroundColor: "#ffffff" }}
        >
          <p
            className="text-xl text-gray-800 md:text-3xl md:leading-normal"
            style={{ fontFamily: "'Lusitana', serif", textAlign: "center" }}
          >
            <Image
              src="/DS_logo2.png"
              alt="Data Chain Logo"
              width={200}
              height={100}
              priority
              style={{ margin: "0 auto" }}
            />

            <br />
            <span style={{ fontSize: "24px", fontFamily: "Helvetica" }}>
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
