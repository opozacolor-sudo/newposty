import type { Metadata } from "next";
import { Suspense } from "react";
import LoginPage from "./login-form";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LoginRoute() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
