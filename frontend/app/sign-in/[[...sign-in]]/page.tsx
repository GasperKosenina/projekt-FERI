import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex bg-blue-500 justify-center items-center h-screen">
      <SignIn path="/sign-in" forceRedirectUrl="/dashboard" />
    </div>
  );
}
