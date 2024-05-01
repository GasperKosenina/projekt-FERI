import NavLinks from "./nav-links";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { SignOutButton, UserButton } from "@clerk/nextjs";

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
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <div className="flex items-center gap-2 rounded-md bg-gray-50 p-3 md:p-2 md:px-3 md:py-4">
          <UserButton afterSignOutUrl="/" />
          <p className="text-sm text-gray-800 md:text-base">
            Welcome, <strong>{user.fullName}!</strong>
          </p>
        </div>
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <div className="flex items-center gap-2 rounded-md bg-gray-50 p-3 md:p-2 md:px-3 md:py-4">
          <SignOutButton redirectUrl="/" />
        </div>
      </div>
    </div>
  );
}
