"use client";
import Navbar from "@/components/Header/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/auth/AuthProvider";

import CartProvider from "@/store/CartProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Apotek Kairo",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <html lang="en">
          <body className={inter.className}>
            <Navbar />

            <main>{children}</main>
          </body>
        </html>
      </CartProvider>
    </AuthProvider>
  );
}