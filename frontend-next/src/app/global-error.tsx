"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <div className="w-full max-w-xl rounded-2xl border border-surface-border bg-surface p-8 text-center">
          <h2 className="text-2xl font-semibold">Application error</h2>
          <p className="mt-3 text-text-secondary">
            A top-level runtime error occurred. Try reloading this route.
          </p>
          <p className="mt-2 text-xs text-text-secondary/80">
            {error?.message || "Unknown error"}
          </p>
          <button
            onClick={reset}
            className="mt-6 rounded-full bg-accent px-5 py-2.5 font-medium text-white hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
