"use client";

import { BanknoteIcon, ChevronRight } from "lucide-react";
import { ButtonComponent } from "./button";
import { updateUserWithEmail } from "@/lib/data";
import { useState } from "react";



export default function FormPaypal() {
    const [email, setEmail] = useState("");
    const [email1, setEmail1] = useState("");
    const [emailMatch, setEmailMatch] = useState(false);

    const handleEmailChange = (event: any) => {
        setEmail(event.target.value);
    };

    const handleEmail1Change = (event: any) => {
        setEmail1(event.target.value);
    };

    const handleVerifyEmail = () => {
        setEmailMatch(email === email1);
    };



    return (
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
                            required
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <BanknoteIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                </div>

            </div>
            <div className="mb-8">
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
                            required
                            value={email1}
                            onChange={handleEmail1Change}
                        />
                        <BanknoteIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                </div>
            </div>
            {(email || email1) && emailMatch ? (
                <ButtonComponent type="submit">Confirm</ButtonComponent>
            ) : (
                (email || email1) && (
                    <ButtonComponent type="button" onClick={handleVerifyEmail} >
                        Verify Your Email
                    </ButtonComponent>
                )
            )}
        </form>
    )

}