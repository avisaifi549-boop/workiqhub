import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

type Search = { mode?: "signin" | "signup"; role?: "freelancer" | "client" };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    mode: search["mode"] === "signup" ? "signup" : "signin",
    role: search["role"] === "client" ? "client" : "freelancer",
  }),
  head: () => ({
    meta: [
      { title: "Sign in or create your Loom account" },
      {
        name: "description",
        content: "Create a free freelancer or client account on Loom and start working today.",
      },
      { property: "og:title", content: "Sign in or create your Loom account" },
      {
        property: "og:description",
        content: "Create a free freelancer or client account on Loom.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode, role } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [accountType, setAccountType] = useState<"freelancer" | "client">(role ?? "freelancer");
  const [busy, setBusy] = useState(false);
  const isSignup = mode === "signup";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`,
            data: { full_name: fullName, account_type: accountType },
          },
        });
        if (error) throw error;
        toast.success("Account created. Welcome to Loom.");
        navigate({ to: "/onboarding" });
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Try email instead.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
      <div className="pointer-events-none absolute -top-40 -right-24 h-96 w-96 rounded-full bg-primary/15 blur-[120px]" />
      <div className="relative w-full max-w-md">
        <Link to="/" className="block text-center font-display text-2xl tracking-wide">
          LOOM<span className="text-primary">.</span>
        </Link>
        <div className="mt-8 glass-strong rounded-2xl border border-border p-7">
          <h1 className="font-display text-3xl uppercase tracking-tight">
            {isSignup ? "Open account" : "Sign in"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignup
              ? "Free to start. Upgrade only when it earns you more."
              : "Welcome back to your marketplace."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {isSignup && (
              <>
                <div>
                  <label htmlFor="fullName" className="label-mono">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-input bg-accent/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <span className="label-mono">I am a</span>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(["freelancer", "client"] as const).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setAccountType(t)}
                        className={
                          accountType === t
                            ? "rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold capitalize text-primary-foreground"
                            : "rounded-lg glass px-3 py-2.5 text-sm font-medium capitalize ring-1 ring-border"
                        }
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div>
              <label htmlFor="email" className="label-mono">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-lg border border-input bg-accent/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="password" className="label-mono">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-lg border border-input bg-accent/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
            >
              {busy ? "Working…" : isSignup ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            OR
            <span className="h-px flex-1 bg-border" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={busy}
            className="w-full rounded-lg glass px-5 py-3 font-semibold ring-1 ring-border transition-all hover:-translate-y-0.5 disabled:opacity-60"
          >
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account?" : "New to Loom?"}{" "}
            <Link
              to="/auth"
              search={{ mode: isSignup ? "signin" : "signup" }}
              className="font-medium text-primary"
            >
              {isSignup ? "Sign in" : "Create one free"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
