import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { SITE_NAME } from "@/src/lib/constants";
import { Providers } from "./providers";

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-plex-arabic",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: SITE_NAME,
  description: "فروشگاه اینترنتی",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" className={`${plexArabic.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}