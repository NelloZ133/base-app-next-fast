import { ReactNode } from "react";
import type { Metadata } from "next";

import "./globals.scss";

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: "Base App Next-Fast",
  description: "Powered by JI & DX",
  icons: "/favicon.ico",
};

export default function RootLayout({ children }: Props) {
  return children;
}
