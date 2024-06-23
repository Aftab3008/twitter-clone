import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "𝕏 | Twitter",
  description: "𝕏 is a social media platform.",
  icons: "/public/logo.svg",
};

const localiztion = {
  signIn: {
    start: {
      title: "Welcome back to X",
      subtitle: "Sign in to continue",
    },
  },
  signUp: {
    start: {
      title: "Create an account",
      subtitle: "Sign up to continue",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        layout: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "blockButton",
        },
        variables: {
          colorText: "#fff",
          colorPrimary: "#1D9BF0",
          colorBackground: "#181818",
          colorInputBackground: "#181818",
          colorInputText: "#fff",
        },
        elements: {
          formButtonPrimary: "text-white hover:bg-white hover:text-blue-1",
        },
      }}
      localization={localiztion}
    >
      <html lang="en" data-theme="black">
        <body className={inter.className}>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#333333",
                color: "#fff",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
