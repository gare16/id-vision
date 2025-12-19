import { redirect } from "next/navigation";

import { isAuthenticated } from "@/components/auth/auth-checker";

export default async function Home() {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    return redirect("/dashboard");
  } else {
    return redirect("/auth/login");
  }
}
