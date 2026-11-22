import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans, Caveat } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const caveat = Caveat({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "verelli.lol | Pre-Build Startup Idea Validator",
  description: "Validate your startup idea with graveyard post-mortems and verified MRR.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${plusJakartaSans.variable} ${caveat.variable}`}
    >
      <body className="bg-pomelli-hero text-[#EDEFE6] min-h-screen antialiased selection:bg-pomelli-lime selection:text-[#14180A]">
        {children}
      </body>
    </html>
  );
}

