import { getUser, postUser } from "@/lib/data";
import "@/app/styles/animations.css";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = auth();

  if (!userId) {
    console.error("No user ID found");
    return;
  }

  const mongoUser = await getUser(userId);
  if (mongoUser) {
    redirect(`/dashboard`);
  }
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
        <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-md shadow-md">
          <h1 className="text-2xl font-bold text-gray-800">Sign in as</h1>
          <form action={postUser} className="flex gap-4 mt-2">
            <button
              className="flex items-center gap-2 p-4 w-30 rounded-xl bg-blue-600 text-white"
              type="submit"
              value="individual"
              name="individual"
            >
              <span>Individual</span>
            </button>

            <button
              className="flex items-center gap-2 p-4 w-30 rounded-xl bg-blue-600 text-white"
              type="submit"
              value="company"
              name="company"
            >
              <span>Company</span>
            </button>

            <button
              className="flex items-center gap-2 p-4 w-30 rounded-xl bg-blue-600 text-white"
              type="submit"
              value="research-institution"
              name="research-institution"
            >
              <span>Research Institution</span>
            </button>

            <button
              className="flex items-center gap-2 p-4 w-30 rounded-xl bg-blue-600 text-white"
              type="submit"
              value="public-administration"
              name="public-administration"
            >
              <span>Public Administration</span>
            </button>

            <button
              className="flex items-center gap-2 p-4 w-30 rounded-xl bg-blue-600 text-white"
              type="submit"
              value="state-administration"
              name="state-administration"
            >
              <span>State Administration</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
