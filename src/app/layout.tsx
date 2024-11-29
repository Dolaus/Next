import "@/styles/global.css";
import ReduxProvider from "@/components/ReduxProvider";
import ClientOnly from "@/components/ClientOnly";
import NavBar from "@/components/navbar/NavBar";
import AuthInitializer from "@/components/AuthInitializer";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <ReduxProvider>
            <AuthInitializer />
            <ClientOnly>
                <NavBar />
            </ClientOnly>
            {children}
        </ReduxProvider>
        </body>
        </html>
    );
}
