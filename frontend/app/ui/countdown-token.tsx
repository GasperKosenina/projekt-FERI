"use client";

import React, { useEffect, useState } from "react";

interface CountdownProps {
    expiresAt: Date;
}

function Countdown({ expiresAt }: CountdownProps) {
    const [countdown, setCountdown] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const difference = expiresAt.getTime() - now.getTime();

            if (difference <= 0) {
                setCountdown("Your token has already expired");
                clearInterval(interval); // Stop the interval if token has expired
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return <span>Your token expires in: {countdown}</span>;
}

export default Countdown;

