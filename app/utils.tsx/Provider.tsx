"use client"
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

interface Props {
    children: React.ReactNode;
}

const Provider = ({children}: Props) => {
    const [nonce, setNonce] = useState<string>("");

    useEffect(() => {
        // Access the nonce value from the meta tag in the document head
        const nonceMetaTag = document.querySelector('meta[name="csp-nonce"]');
        if (nonceMetaTag) {
            setNonce(nonceMetaTag.getAttribute("x-nonce") || "");
        }
    }, []);

    return <ThemeProvider attribute="class" nonce={nonce}>{children}</ThemeProvider>;
}

export default Provider;
