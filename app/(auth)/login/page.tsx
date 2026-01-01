"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      // signIn may redirect; if it throws, allow user to retry
      // keep a console log for easier local debugging
      // eslint-disable-next-line no-console
      console.error("Sign-in error:", err);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to manage properties, leads and blog content.</p>
        </div>

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-md bg-[var(--color-primary)] px-4 py-3 text-white disabled:opacity-60"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="4"></circle>
                <path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="4" strokeLinecap="round"></path>
              </svg>
              <span>Signing in…</span>
            </>
          ) : (
            <>
              <svg className="h-5 w-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.9 0 7 1.4 9.3 3.3l6.9-6.9C36.6 2.8 30.7 0 24 0 14.7 0 6.9 5.5 2.9 13.4l8 6.2C13.8 15 18.5 9.5 24 9.5z" />
                <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-2.9-.4-4.2H24v8.1h12.8c-.6 3-2.6 5.6-5.6 7.3l8.6 6.7C43.9 38.8 46.5 32.1 46.5 24.5z" />
                <path fill="#4A90E2" d="M10.9 28.9a14.6 14.6 0 01-.8-4.4c0-1.5.3-3 1-4.4L2.9 13.4C1 16.9 0 20.9 0 25c0 4 1 8 2.9 11.6l8-6.7z" />
                <path fill="#FBBC05" d="M24 48c6.7 0 12.6-2.8 16.9-7.5l-8.6-6.7c-2.4 1.6-5.4 2.6-8.3 2.6-5.5 0-10.2-5.5-12.2-10.5l-8 6.2C6.9 42.5 14.7 48 24 48z" />
              </svg>
              <span>Sign in with Google</span>
            </>
          )}
        </button>

        <div className="mt-5 text-center text-sm text-gray-600">
          By continuing you agree to the site terms. Need help?{' '}
          <a href="/contact" className="font-medium text-[var(--color-primary)]">Contact support</a>
        </div>
      </div>
    </div>
  );
}
