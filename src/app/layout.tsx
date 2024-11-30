import "@/styles/global.css";
import ReduxProvider from "@/components/ReduxProvider";
import ClientOnly from "@/components/ClientOnly";
import NavBar from "@/components/navbar/NavBar";
import AuthInitializer from "@/components/AuthInitializer";
import {Box} from "@mui/material";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body style={{height: "100%", margin: 0}}>
        <ReduxProvider>
            <AuthInitializer/>
            <ClientOnly>
                <NavBar/>
            </ClientOnly>
            <Box
                style={{
                    marginTop: "64px",
                    height: "calc(100vh - 64px)",
                    overflowY: "auto",
                    padding: "0",
                    boxSizing: "border-box",
                }}
            >
                {children}
            </Box>
        </ReduxProvider>
        </body>
        </html>
    );
}
