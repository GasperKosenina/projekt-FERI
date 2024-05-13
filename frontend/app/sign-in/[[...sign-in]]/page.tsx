import { SignIn } from "@clerk/nextjs";
import "../../styles/animations.css";


export default function Page() {
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
        <SignIn path="/sign-in" forceRedirectUrl="/dashboard" />
      </div>
    </>
  );
}
