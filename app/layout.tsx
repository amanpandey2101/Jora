import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/ui/Navbar";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zora",
  description: "Project Management App",
  icons:{
    icon:'/assets/logo.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider 
      appearance={{
        baseTheme: undefined,
        elements: {
          formButtonPrimary: "text-white bg-primary hover:bg-primary/90",
          card: "bg-white/80 dark:bg-gray-950/90 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton: "bg-white/5 border-white/10 text-foreground hover:bg-white/10",
          formFieldLabel: "text-foreground",
          formFieldInput: "bg-transparent border border-input text-foreground focus:ring-primary focus:border-primary",
          footerActionLink: "text-primary hover:text-primary/90",
          footer: "text-muted-foreground bg-transparent"
        },
        variables: {
          colorPrimary: "#7c3aed",
          colorInputBackground: "transparent", 
          colorInputText: "inherit"
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${outfit.className} cosmic-bg text-foreground min-h-screen flex flex-col`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex-grow pt-20">{children}</main>
            <Toaster richColors/>
             {/* <footer className="border-t border-black/5 dark:border-white/5 py-8 mt-12 bg-white/20 dark:bg-black/20 backdrop-blur-sm">
              <div className="container mx-auto text-center text-muted-foreground">
                <p>Made with ❤️, by Aman✨</p>
              </div>
            </footer>  */}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
