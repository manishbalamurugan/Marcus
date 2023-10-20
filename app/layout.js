import "./globals.css";

export const metadata = {
  title: "Marcus",
  description:
    "A chatbot built for depression screening."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-gray-100 to-gray-50">{children}</body>
    </html>
  );
}
