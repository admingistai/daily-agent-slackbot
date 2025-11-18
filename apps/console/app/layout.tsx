import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Agent Console",
  description: "Admin console for managing AI intelligence agents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
