import { getUser, postUser } from "@/lib/data";
import "@/app/styles/animations.css";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import FormPaypal from "../ui/formPaypal";

export default async function Page() {

    const { userId } = auth();

    if (!userId) {
        console.error("No user ID found");
        return;
    }

    const mongoUser = await getUser(userId);
    if (mongoUser.email) {
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
                <div className="flex flex-col items-center gap-4 bg-white p-12 rounded-lg shadow-lg max-w">
                    <h1 className="text-2xl font-bold text-gray-800">Paypal account:</h1>
                    <FormPaypal />
                </div>
            </div>
        </>
    );
}
