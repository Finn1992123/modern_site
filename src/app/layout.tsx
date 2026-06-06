import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Modern Language | Κέντρο Ξένων Γλωσσών στον Γέρακα",
  description:
    "Κέντρο ξένων γλωσσών Modern Language στον Γέρακα. Αγγλικά, Γαλλικά, Γερμανικά, Ισπανικά, πιστοποιήσεις, app μαθητή και δωρεάν αξιολόγηση επιπέδου.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el">
      <body>{children}</body>
    </html>
  );
}
