import { ReactNode } from "react";
import type { Metadata } from "next";

import "./globals.scss";

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: "Control Item Management",
  description: "Powered by JI & DX",
  icons: "/favicon.ico",
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  return children;
}
