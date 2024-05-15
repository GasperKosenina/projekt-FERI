import { getUser, postUser } from "@/lib/data";
import "@/app/styles/animations.css";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BanknoteIcon, ChevronRight } from "lucide-react";
import { ButtonComponent } from "../ui/button";
import { updateUserWithEmail } from "@/lib/data";

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
                    <form action={updateUserWithEmail} className="flex flex-col gap-4 mt-10">
                        <div className="mb-8">
                            <div className="flex gap-1">
                                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                                    Email
                                </label>
                                <ChevronRight className="h-5 w-5 text-gray-500" />
                                <p className="text-sm text-gray-500">Paypal account email to receive payments</p>
                            </div>
                            <div className="relative mt-2 rounded-md">
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter Paypal email"
                                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    />
                                    <BanknoteIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>

                        </div>
                        {/*                         <div className="mb-8">
                            <div className="flex gap-1">
                                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                                    Repeat Your Email
                                </label>
                                <ChevronRight className="h-5 w-5 text-gray-500" />
                                <p className="text-sm text-gray-500">Paypal account email to receive payments</p>
                            </div>
                            <div className="relative mt-2 rounded-md">
                                <div className="relative">
                                    <input
                                        id="email1"
                                        name="email1"
                                        type="email"
                                        placeholder="Repeat Paypal email"
                                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    />
                                    <BanknoteIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                        </div> */}
                        <ButtonComponent type="submit">Confirm</ButtonComponent>
                    </form>
                </div>
            </div>
        </>
    );
}
