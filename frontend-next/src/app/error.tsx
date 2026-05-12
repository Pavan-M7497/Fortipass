"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App route error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-xl rounded-2xl border border-surface-border bg-surface p-8 text-center">
        <h2 className="text-2xl font-semibold text-foreground">Something went wrong</h2>
        <p className="mt-3 text-text-secondary">
          FortiPass hit an unexpected runtime error. Your UI is still available and can recover.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-accent px-5 py-2.5 font-medium text-white hover:bg-blue-600"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-surface-border px-5 py-2.5 font-medium text-foreground"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
