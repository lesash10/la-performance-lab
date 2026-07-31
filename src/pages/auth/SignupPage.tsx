import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { homePathForRole, useAuth } from "@/auth/AuthProvider";
import logoImg from "@/assets/incinerate/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export function SignupPage() {
  const { user, profile, loading, signUp, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });

  if (!loading && user && profile) {
    return <Navigate to={homePathForRole(profile.role)} replace />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    const { error, session } = await signUp({
      email: values.email.trim(),
      password: values.password,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
    });

    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }

    if (!session) {
      toast.success("Check your email to confirm your account, then log in.");
      navigate("/login", { replace: true });
      setSubmitting(false);
      return;
    }

    // Profile row is created by DB trigger; give it a moment then load
    await new Promise((r) => setTimeout(r, 400));
    const nextProfile = await refreshProfile();
    toast.success("Account created");
    navigate(homePathForRole(nextProfile?.role ?? "user"), { replace: true });
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
            Create account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign up to request sessions and manage bookings.
          </p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" autoComplete="given-name" {...form.register("firstName")} />
                {form.formState.errors.firstName && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" autoComplete="family-name" {...form.register("lastName")} />
                {form.formState.errors.lastName && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
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
              {submitting ? "Creating…" : "Sign up"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-flame hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
