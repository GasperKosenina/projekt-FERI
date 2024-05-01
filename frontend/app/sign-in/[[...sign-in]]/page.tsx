import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex bg-black justify-center items-center h-screen">
      <SignIn path="/sign-in" forceRedirectUrl="/dashboard" />
    </div>
  );
}
