import "./globals.css";
import Script from "next/script";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "PROPEASE",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Cloudinary Script */}
        <Script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          strategy="beforeInteractive"
        />

        {/* Navbar for all pages */}
        <Navbar />

        <main>{children}</main>

        {/* Footer for all pages */}
      </body>
    </html>
  );
}
