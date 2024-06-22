import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "X",
  description: "X is a social media platform.",
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
          logoImageUrl: "/icons/yoom-logo.svg",
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
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
