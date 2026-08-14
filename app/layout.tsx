import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dog Mind — Decode your dog's vibe",
  description: "Upload a dog photo and let AI decode the mood, body language, and very important thoughts behind those eyes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
