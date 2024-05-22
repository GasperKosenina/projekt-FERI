"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import {
  CopyIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Dataset } from "@/lib/definitions";
import Link from "next/link";

interface PaymentSuccessProps {
  access_token: string;
  dataset: Dataset;
}

const PaymentSuccess = ({ access_token, dataset }: PaymentSuccessProps) => {
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);
  const [curlCopied, setCurlCopied] = useState(false);
  const [confetti, setConfetti] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
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

  const curlCommand = `curl -H "Authorization: Bearer <your_access_token_here>" ${dataset.url}`;

  const copyCurlToClipboard = () => {
    navigator.clipboard.writeText(curlCommand);
    setCurlCopied(true);

    // Reset "Copied" state after a few seconds
    setTimeout(() => {
      setCurlCopied(false);
    }, 3000);
  };

  return (
    <div className="max-w-full mx-auto p-14 bg-gray-50 rounded-md relative">
      {confetti && (
        <div style={{ transition: "opacity 1s ease-in-out", opacity }}>
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
          />
        </div>
      )}
      <h1 className="text-2xl font-bold text-blue-600 mb-8">
        Payment successful!
      </h1>
      <div className="mb-4">
        <div className="flex flex-row gap-2 mb-4">
          <InfoIcon size={40} />
          <p className="text-md">
            Please save your access token as it won't be stored in our database.
            You will need it to access the dataset you purchased. Once you close
            or refresh this tab you won't be able to retrieve it again.
          </p>
        </div>
        <div className="flex items-center">
          <input
            type={showToken ? "text" : "password"}
            value={access_token}
            readOnly
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
          />
          <button
            onClick={toggleShowToken}
            className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center focus:outline-none"
          >
            {showToken ? (
              <EyeOffIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
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
      </div>
      <div className="mt-8 p-6 bg-white border border-gray-200 rounded-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          How to Use URL and Access Token in Postman
        </h2>
        <ol className="list-decimal list-inside text-gray-700">
          <li className="mb-2">
            <strong>Retrieve the URL and Access Token</strong>: After a
            successful payment, note down the URL and access token displayed in
            this component.
          </li>
          <li className="mb-2">
            <strong>Open Postman</strong>: Download and install Postman from the{" "}
            <a
              href="https://www.postman.com/"
              target="_blank"
              className="text-blue-500 underline"
            >
              official Postman website
            </a>
            .
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
            <strong>Send the Request</strong>: Click on "Send" and review the
            server's response.
          </li>
        </ol>
      </div>

      <div className="mt-8 p-6 bg-white border border-gray-200 rounded-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Test with curl</h2>
        <p className="text-gray-700 mb-4">
          You can also use the following curl command to test the request in
          your terminal:
        </p>
        <pre className="bg-gray-100 p-4 rounded-md text-sm text-gray-700 mb-4">
          {curlCommand}
        </pre>
        <button
          onClick={copyCurlToClipboard}
          className="bg-[#3b82f6] hover:bg-[#61a5fa] text-white px-4 py-2 rounded-md flex items-center focus:outline-none"
          disabled={curlCopied} // Disable button if already copied
        >
          {curlCopied ? (
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
      <div className="mt-8 p-6 bg-white border border-gray-200 rounded-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Next Steps</h2>
        <span className="text-gray-700 mb-4">
          If you have securely saved your access token, you can go back to the{" "}
          <strong>{dataset.name}</strong> page and see the dataset details.
        </span>
        <Link href={`/dashboard/datasets/purchased/${dataset.id}`}>
          <p className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center focus:outline-none w-20 mt-4 justify-center">
            <Check />
          </p>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
