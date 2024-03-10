 "use client"
import { ThemeProvider } from "next-themes";

interface ProviderProps {
    children: React.ReactNode;
    nonce: string; // Directly expect a string nonce
}

const Provider = ({ children, nonce }: ProviderProps) => {
    // No need for useState or useEffect if you're directly passing the nonce as a prop
    return <ThemeProvider attribute="class" nonce={nonce}>{children}</ThemeProvider>;
}

export default Provider;
