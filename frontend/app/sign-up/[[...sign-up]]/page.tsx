import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex bg-black justify-center items-center h-screen">
      <SignUp path="/sign-up" forceRedirectUrl="/dashboard" />
    </div>
  );
}
