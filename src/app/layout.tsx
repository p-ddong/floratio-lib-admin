import "./globals.css";
import LayoutClientWrapper from "@/components/LayoutClientWrapper/LayoutClientWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LayoutClientWrapper>{children}</LayoutClientWrapper>
      </body>
    </html>
  );
}
