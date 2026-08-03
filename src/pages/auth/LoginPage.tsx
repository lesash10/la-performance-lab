import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { resolvePostAuthPath, useAuth } from "@/auth/AuthProvider";
import logoImg from "@/assets/incinerate/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { user, profile, loading, signIn, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const from = (location.state as { from?: string } | null)?.from;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  if (!loading && user && profile) {
    return <Navigate to={resolvePostAuthPath(profile.role, from)} replace />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    const { error } = await signIn(values.email.trim(), values.password);
    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }

    const nextProfile = await refreshProfile();
    toast.success("Signed in");
    navigate(resolvePostAuthPath(nextProfile?.role, from), { replace: true });
    setSubmitting(false);
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div className="pointer-events-none absolute inset-0 grain opacity-90" aria-hidden />
      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="mb-8 flex justify-center">
          <img src={logoImg} alt="Incinerate" className="h-8 w-auto" width={401} height={68} />
        </Link>
        <div className="rounded-xl border border-border/60 bg-surface-elevated/80 p-6 shadow-lg backdrop-blur md:p-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Log in
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Access your Incinerate account.
          </p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-flame hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="h-11 w-full rounded-md bg-flame font-semibold text-background shadow-flame hover:bg-flame/90"
            >
              {submitting ? "Signing in…" : "Log in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link to="/signup" className="text-flame hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
