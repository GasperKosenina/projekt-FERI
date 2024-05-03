import NavLinks from "./nav-links";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import AcmeLogo from "./acme-logo";


export default async function SideNav() {
  const { userId } = auth();
  if (!userId) {
    console.error("No user ID found");
    return null;
  }

  const user = await clerkClient.users.getUser(userId);
  if (!user) {
    console.error("No user found");
    return null;
  }

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40">
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </div>

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <div className="flex items-center gap-2 rounded-md bg-gray-50 p-3 md:p-2 md:px-3 md:py-4">
          <UserButton afterSignOutUrl="/" />
          <p className="text-sm text-gray-800 md:text-base">
            Welcome, {user.fullName ? user.fullName : user.username}
          </p>
        </div>
        {/*         <div className="flex items-center gap-2 rounded-md bg-gray-50 p-3 md:p-2 md:px-3 md:py-4">
          <SignOutButton redirectUrl="/" />
        </div> */}
      </div>
    </div>
  );
}
