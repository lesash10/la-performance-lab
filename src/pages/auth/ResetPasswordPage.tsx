import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import logoImg from "@/assets/incinerate/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const MIN_PASSWORD_LENGTH = 8;

const schema = z
  .object({
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    let mounted = true;
    let ready = false;
    let timeoutId: number | undefined;

    const markReady = () => {
      if (!mounted || ready) return;
      ready = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      setRecoveryReady(true);
      setCheckingSession(false);
      setErrorMessage(null);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        markReady();
      }
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) {
        markReady();
        return;
      }
      // Allow time for the client to exchange recovery tokens from the URL.
      timeoutId = window.setTimeout(() => {
        if (!mounted || ready) return;
        setCheckingSession(false);
        setErrorMessage(
          "This reset link is invalid or has expired. Request a new password reset email.",
        );
      }, 1500);
    });

    return () => {
      mounted = false;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const { error } = await supabase.auth.updateUser({ password: values.password });

    if (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
      return;
    }

    setSuccessMessage("Password updated. Redirecting to log in…");
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
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
            Choose a new password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter and confirm your new password below.
          </p>

          {checkingSession ? (
            <p className="mt-6 text-sm text-muted-foreground">Verifying reset link…</p>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  disabled={!recoveryReady || submitting}
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  disabled={!recoveryReady || submitting}
                  {...form.register("confirmPassword")}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              {errorMessage && (
                <p className="text-sm text-destructive" role="alert">
                  {errorMessage}
                </p>
              )}
              {successMessage && (
                <p className="text-sm text-foreground" role="status">
                  {successMessage}
                </p>
              )}
              <Button
                type="submit"
                disabled={!recoveryReady || submitting}
                className="h-11 w-full rounded-md bg-flame font-semibold text-background shadow-flame hover:bg-flame/90"
              >
                {submitting ? "Updating…" : "Update password"}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/forgot-password" className="text-flame hover:underline">
              Request a new reset link
            </Link>
            {" · "}
            <Link to="/login" className="text-flame hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
