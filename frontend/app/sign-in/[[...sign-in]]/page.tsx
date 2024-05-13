import { SignIn } from "@clerk/nextjs";
import "@/app/styles/animations.css";
export default async function Page() {
  return (
    <>
      <div className="background">
        <ul>
          {Array.from({ length: 18 }).map((_, idx) => (
            <li key={idx}></li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center items-center h-screen">
        <SignIn path="/sign-in" forceRedirectUrl="/sign-in-type" />
      </div>
    </>
  );
}
