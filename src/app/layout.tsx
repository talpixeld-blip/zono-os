import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: 'ZONO — מערכת ההפעלה החכמה לסוכני נדל"ן',
  description:
    'ZONO היא מערכת הפעלה מבוססת בינה מלאכותית לסוכני נדל"ן בישראל: ניהול לקוחות, התאמות חכמות, מסע הנכס וזיהוי הזדמנויות בשוק.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface text-ink font-sans">
        {children}
      </body>
    </html>
  );
}
