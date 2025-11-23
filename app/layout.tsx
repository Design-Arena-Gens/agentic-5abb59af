import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "بوصلة الحياة - Storyboard",
  description: "لوحة عرض سينمائية لبوصلة الحياة لمدة 12-15 ثانية"
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
