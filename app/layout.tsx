import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sovia Galgame",
  description: "A visual novel featuring Sovia",
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
