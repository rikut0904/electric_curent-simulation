import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "直列接続の水流モデル",
  description: "直列接続の電流・電圧・合成抵抗を水流の等価モデルで見る教材アニメーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
