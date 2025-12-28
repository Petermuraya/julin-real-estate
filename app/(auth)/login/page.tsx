"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <button
        onClick={() => signIn("google")}
        className="rounded-lg px-6 py-3 text-white"
        style={{ background: "var(--color-primary)" }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
