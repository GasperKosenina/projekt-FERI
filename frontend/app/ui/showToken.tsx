"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { CopyIcon, CheckCircleIcon } from "lucide-react";
import { Dataset } from "@/lib/definitions";

interface PaymentSuccessProps {
    access_token: string;
    dataset: Dataset;
}

const PaymentSuccess = ({ access_token, dataset }: PaymentSuccessProps) => {
    const [showToken, setShowToken] = useState(false);
    const [copied, setCopied] = useState(false);
    const [confetti, setConfetti] = useState(true);
    const [opacity, setOpacity] = useState(1);
    const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
        }

        const fadeOutTime = 1000; // Duration of the fade-out effect in milliseconds
        const totalTime = 6000; // Total time confetti is shown

        const timer = setTimeout(() => setConfetti(false), totalTime);
        const fadeTimer = setTimeout(() => setOpacity(0), totalTime - fadeOutTime);

        return () => {
            clearTimeout(timer);
            clearTimeout(fadeTimer);
        };
    }, []);

    const toggleShowToken = () => {
        setShowToken(!showToken);
    };

    const copyTokenToClipboard = () => {
        navigator.clipboard.writeText(access_token);
        setCopied(true);

        // Reset "Copied" state after a few seconds
        setTimeout(() => {
            setCopied(false);
        }, 3000);
    };

    return (
        <div className="max-w-full mx-auto p-14 bg-gray-50 rounded-md relative">
            {confetti && (
                <div style={{ transition: 'opacity 1s ease-in-out', opacity }}>
                    <Confetti width={windowDimensions.width} height={windowDimensions.height} />
                </div>
            )}
            <h1 className="text-2xl font-bold text-green-600 mb-4">Payment successful!</h1>
            <p className="text-gray-700 mb-6">Thank you for your payment.</p>
            <div className="mb-4 flex items-center">
                <input
                    type={showToken ? "text" : "password"}
                    value={access_token}
                    readOnly
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
                />
                <button
                    onClick={copyTokenToClipboard}
                    className="ml-2 bg-[#3b82f6] hover:bg-[#61a5fa] text-white px-4 py-2 rounded-md flex items-center focus:outline-none"
                    disabled={copied} // Disable button if already copied
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

            <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-700 mb-2">Dataset URL</h2>
                <p className="text-gray-700">{dataset.url}</p>
            </div>

            <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-700 mb-2">Dataset Duration</h2>
                <p className="text-gray-700">{dataset.duration} hours</p>
            </div>

            <div className="mt-8 p-6 bg-white border border-gray-200 rounded-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">How to Use URL and Access Token in Postman</h2>
                <ol className="list-decimal list-inside text-gray-700">
                    <li className="mb-2">
                        <strong>Retrieve the URL and Access Token</strong>: After a successful payment, note down the URL and access token displayed in this component.
                    </li>
                    <li className="mb-2">
                        <strong>Open Postman</strong>: Download and install Postman from the <a href="https://www.postman.com/" target="_blank" className="text-blue-500 underline">official Postman website</a>.
                    </li>
                    <li className="mb-2">
                        <strong>Create a New Request</strong>:
                        <ul className="list-disc list-inside ml-4">
                            <li>Click on "New" and select "HTTP Request".</li>
                            <li>Select the method (e.g., GET) and enter the URL.</li>
                        </ul>
                    </li>
                    <li className="mb-2">
                        <strong>Add the Access Token</strong>:
                        <ul className="list-disc list-inside ml-4">
                            <li>Go to the "Authorization" tab.</li>
                            <li>Select "Bearer Token" and paste the access token.</li>
                        </ul>
                    </li>
                    <li className="mb-2">
                        <strong>Send the Request</strong>: Click on "Send" and review the server's response.
                    </li>
                </ol>
                <p className="mt-4 text-gray-700">
                    Example of an HTTP GET request:
                </p>
                <pre className="bg-gray-100 p-4 rounded-md text-sm text-gray-700">
                    GET /dataset HTTP/1.1{'\n'}
                    Host: api.example.com{'\n'}
                    Authorization: Bearer your_access_token_here
                </pre>
            </div>
        </div>
    );
};

export default PaymentSuccess;
