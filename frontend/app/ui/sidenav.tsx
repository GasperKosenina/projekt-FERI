import NavLinks from "./nav-links";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import DataChainLogo from "./datachain-logo";
import { TokenRequest } from "@/lib/definitions";
import {
  getAllAcceptedByUserId,
  getAllDeclinedByUserId,
  getAllPendingByUserId,
  getUser,
} from "@/lib/data";
export default async function SideNav() {
  const { userId } = auth();
  if (!userId) {
    console.error("No user ID found");
    return null;
  }
  let user;
  try {
    user = await clerkClient.users.getUser(userId);
  } catch (error) {
    return "Check Your Internet Connection!";
  }

  const mongoUser = await getUser(userId);
  const admin = mongoUser.admin;

  const pendingRequests: TokenRequest[] =
    (await getAllPendingByUserId(userId)) || [];
  const declinedRequests: TokenRequest[] =
    (await getAllDeclinedByUserId(userId)) || [];
  const acceptedRequests: TokenRequest[] =
    (await getAllAcceptedByUserId(userId)) || [];

  let unseenCount = 0;

  pendingRequests.forEach((request) => {
    if (request.seen === false) {
      unseenCount++;
    }
  });

  acceptedRequests.forEach((request) => {
    if (request.acceptedSeen === false) {
      unseenCount++;
    }
  });

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div
        className="mb-2 flex h-20 items-end justify-start rounded-md p-4 md:h-40"
        style={{ backgroundColor: "#3b82f6" }}
      >
        <div className="flex justify-center w-32md:w-40">
          <DataChainLogo />
        </div>
      </div>

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks unseenCount={unseenCount} admin={admin} />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <div className="flex items-center gap-2 rounded-md bg-gray-50 p-3 md:p-2 md:px-3 md:py-4">
          <UserButton afterSignOutUrl="/" />
          <p className="text-sm text-gray-800 md:text-base">
            {user.fullName ? user.fullName : user.username}
          </p>
        </div>
      </div>
    </div>
  );
}
