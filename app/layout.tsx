import type { Metadata } from "next";
import "./globals.css";
import { Kanit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/ui/Navbar";
import { Toaster } from "sonner";


// [#D62828]
// [#F77F00]
// [#FCBF49]
// [#EAE2B7]

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["100", "200", "400", "500"], // Include the weights you need
  style: ["normal", "italic"], // Include the styles you need
  display: "swap", // Improves performance by swapping fonts after loading
});

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
        elements: {
          formButtonPrimary: "text-white bg-blue-400 hover:bg-blue-600",
        },
      }}
    >
      <html lang="en">
      <body className={`${kanit.className} dotted-background`}>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors/>
           <footer className="bg-[#D62828]">
            <div className="container mx-auto py-4 text-center text-gray-200">
              <p>Made with ❤️, by Aman✨</p>
            </div>
          </footer> 
        </body>
      </html>
    </ClerkProvider>
  );
}
