import AcmeLogo from "./ui/acme-logo";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <AcmeLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-3 py-10 md:w-2/5 md:px-20">
          <p
            className="text-xl text-gray-800 md:text-3xl md:leading-normal"
            style={{ fontFamily: "'Lusitana', serif" }}
          >
            <strong>Welcome to Acme!</strong>
            <br />
            Explore the future of secure and efficient data sharing with our
            advanced data management platform.
          </p>
          <Link
            href="/sign-up"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Sign Up</span>
          </Link>
          <Link
            href="/sign-in"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Sign In</span>
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* <Image
            className="hidden md:block mr-20"
            src="/123.png"
            width={200}
            height={200}
            alt="Acme"
          />
          <Image
            src="/456.png"
            width={200}
            height={200}
            alt="Acme"
          /> */}
        </div>
      </div>
    </main>
  );
}
