import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Register - VMS",
  description: "Create your VMS account",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
