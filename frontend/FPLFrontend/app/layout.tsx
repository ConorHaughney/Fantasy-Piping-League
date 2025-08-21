import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { tartan, TartanBg } from "./components/tartan";
import NavBar from "./components/NavBar";
import BandDataManager from "./components/bandDataManager";
import Footer from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <BandDataManager />
        <TartanBg tartan={tartan} />
        <NavBar />
        <div className="container mx-auto px-4 pt-12 flex-grow">
          <main>{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}