import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout/ClientLayout";
import Navbar from "@/components/Navbar/Navbar";
import SmoothScroll from "@/components/SmoothScroll/SmoothScroll";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "sw3do - Developer Portfolio",
  description: "Full-stack developer portfolio and projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-linear-to-br from-[#000000] to-[#212121] min-h-screen font-(family-name:--font-inter)`}
      >
        <ClientLayout>
          <SmoothScroll />
          <Navbar />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
