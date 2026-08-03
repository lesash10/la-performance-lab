import { useState } from "react";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import logoImg from "@/assets/incinerate/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(values.email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
      return;
    }

    setSuccessMessage(
      "If an account exists for that email, a password reset link has been sent. Check your inbox.",
    );
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
            Reset password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and we&apos;ll send a link to choose a new password.
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
              disabled={submitting}
              className="h-11 w-full rounded-md bg-flame font-semibold text-background shadow-flame hover:bg-flame/90"
            >
              {submitting ? "Sending…" : "Send reset link"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-flame hover:underline">
              Back to log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
