import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Register - ID Vision",
  description: "Create your ID Vision account",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
