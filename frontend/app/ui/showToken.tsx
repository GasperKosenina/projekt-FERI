"use client";

import { useState } from "react";
import { CopyIcon, CheckCircleIcon } from "lucide-react";

interface PaymentSuccessProps {
    access_token: string;
}

const PaymentSuccess = ({ access_token }: PaymentSuccessProps) => {
    const [showToken, setShowToken] = useState(false);
    const [copied, setCopied] = useState(false);

    const toggleShowToken = () => {
        setShowToken(!showToken);
    };

    const copyTokenToClipboard = () => {
        navigator.clipboard.writeText(access_token);
        setCopied(true);

        // Ponastavitev stanja "Copied" po nekaj sekundah
        setTimeout(() => {
            setCopied(false);
        }, 3000);
    };

    return (
        <div className="max-w-full mx-auto p-14 bg-gray-50 shadow-md rounded-md">
            <h1 className="text-2xl font-bold text-green-600 mb-4">Payment successful!</h1>
            <p className="text-gray-700 mb-6">Thank you for your payment.</p>
            <div className="mb-4 flex items-center">
                <input
                    type={showToken ? "text" : "password"}
                    value={access_token}
                    readOnly
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <button
                    onClick={copyTokenToClipboard}
                    className="ml-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center focus:outline-none"
                    disabled={copied} // Onemogoči gumb, če je že kopirano
                >
                    {copied ? (
                        <>
                            <CheckCircleIcon className="w-5 h-5 mr-2" /> Copied
                        </>
                    ) : (
                        <>
                            <CopyIcon className="w-5 h-5 mr-2" /> Copy
                        </>
                    )}
                </button>
            </div>
            <label className="flex items-center">
                <input
                    type="checkbox"
                    checked={showToken}
                    onChange={toggleShowToken}
                    className="mr-2"
                />
                <span className="text-gray-700">Show token</span>
            </label>
        </div>
    );
};

export default PaymentSuccess;
