import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { z } from "zod";

import { CalendlyInlineEmbed } from "@/components/calendly/CalendlyInlineEmbed";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CalendlyPrefill } from "@/types/calendly";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "About you" },
  { id: 2, label: "Book" },
] as const;

const infoSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid email"),
});

type InfoValues = z.infer<typeof infoSchema>;

export type BookingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function Progress({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Booking progress">
      {STEPS.map((s, i) => {
        const active = step === s.id;
        const done = step > s.id;
        return (
          <li key={s.id} className="flex min-w-0 flex-1 items-center gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div
                className={cn(
                  "h-1 rounded-full transition-colors",
                  done || active ? "bg-flame" : "bg-border",
                )}
                aria-hidden
              />
              <span
                className={cn(
                  "truncate text-[11px] font-medium tracking-wide uppercase",
                  active ? "text-flame" : done ? "text-foreground/80" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 ? <span className="sr-only">/</span> : null}
          </li>
        );
      })}
    </ol>
  );
}

export function BookingModal({ open, onOpenChange }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState<InfoValues>({ firstName: "", lastName: "", email: "" });
  const [infoErrors, setInfoErrors] = useState<Partial<Record<keyof InfoValues, string>>>({});

  useEffect(() => {
    if (!open) {
      const id = window.setTimeout(() => {
        setStep(1);
        setInfo({ firstName: "", lastName: "", email: "" });
        setInfoErrors({});
      }, 200);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  const prefill = useMemo<CalendlyPrefill>(() => {
    const firstName = info.firstName.trim();
    const lastName = info.lastName.trim();
    const email = info.email.trim();

    return {
      firstName,
      lastName,
      name: [firstName, lastName].filter(Boolean).join(" "),
      email,
    };
  }, [info]);

  const goNextFromInfo = () => {
    const parsed = infoSchema.safeParse(info);
    if (!parsed.success) {
      const next: Partial<Record<keyof InfoValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof InfoValues;
        if (!next[key]) next[key] = issue.message;
      }
      setInfoErrors(next);
      return;
    }
    setInfoErrors({});
    setInfo(parsed.data);
    setStep(2);
  };

  const isCalendlyStep = step === 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex flex-col gap-0 overflow-hidden border-border/70 bg-background p-0 shadow-elevated sm:rounded-sm",
          isCalendlyStep
            ? // Contained width so native Calendly form/dropdowns don’t span edge-to-edge.
              "h-[min(100dvh,100svh)] max-h-[min(100dvh,100svh)] w-[min(100vw,100%)] max-w-none rounded-none sm:h-[min(88dvh,780px)] sm:max-h-[min(88dvh,780px)] sm:w-[calc(100%-2rem)] sm:max-w-xl sm:rounded-sm"
            : "max-h-[min(92dvh,920px)] w-[calc(100%-1.5rem)] max-w-lg",
        )}
      >
        <div
          className={cn(
            "shrink-0 border-b border-border/60",
            isCalendlyStep ? "px-4 pb-2.5 pt-3.5 sm:px-5 sm:pb-3 sm:pt-4" : "px-5 pb-4 pt-5 sm:px-6 sm:pt-6",
          )}
        >
          <DialogHeader className={cn("pr-8 text-left", isCalendlyStep ? "space-y-1" : "space-y-3")}>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-flame">
              Book your first session
            </p>
            <DialogTitle
              className={cn(
                "font-display font-semibold tracking-tight",
                isCalendlyStep ? "text-xl sm:text-2xl" : "text-2xl",
              )}
            >
              {step === 1 && "Tell us who you are"}
              {step === 2 && "Pick a time"}
            </DialogTitle>
            {!isCalendlyStep ? (
              <DialogDescription className="text-sm text-muted-foreground">
                We’ll use this to reserve your session with Roger.
              </DialogDescription>
            ) : (
              <DialogDescription className="text-xs text-muted-foreground sm:text-sm">
                Your name and email are prefilled. Choose a time — scheduling stays on this page.
              </DialogDescription>
            )}
          </DialogHeader>
          <div className={cn(isCalendlyStep ? "mt-2.5" : "mt-5")}>
            <Progress step={step} />
          </div>
        </div>

        <div
          className={cn(
            "min-h-0 flex-1",
            // One scroll surface for form steps; Calendly step fills remaining height (iframe scrolls inside itself).
            isCalendlyStep ? "overflow-hidden p-0" : "overflow-y-auto px-5 py-5 sm:px-6",
          )}
        >
          {step === 1 ? (
            <form
              id="booking-info-form"
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                goNextFromInfo();
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="booking-first-name">First name</Label>
                  <Input
                    id="booking-first-name"
                    autoComplete="given-name"
                    value={info.firstName}
                    onChange={(e) => setInfo((v) => ({ ...v, firstName: e.target.value }))}
                    className="h-11 border-border/60 bg-background/90 shadow-none focus-visible:border-flame/50"
                    aria-invalid={!!infoErrors.firstName}
                  />
                  {infoErrors.firstName ? (
                    <p className="text-xs text-destructive" role="alert">
                      {infoErrors.firstName}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="booking-last-name">Last name</Label>
                  <Input
                    id="booking-last-name"
                    autoComplete="family-name"
                    value={info.lastName}
                    onChange={(e) => setInfo((v) => ({ ...v, lastName: e.target.value }))}
                    className="h-11 border-border/60 bg-background/90 shadow-none focus-visible:border-flame/50"
                    aria-invalid={!!infoErrors.lastName}
                  />
                  {infoErrors.lastName ? (
                    <p className="text-xs text-destructive" role="alert">
                      {infoErrors.lastName}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-email">Email</Label>
                <Input
                  id="booking-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={info.email}
                  onChange={(e) => setInfo((v) => ({ ...v, email: e.target.value }))}
                  className="h-11 border-border/60 bg-background/90 shadow-none focus-visible:border-flame/50"
                  aria-invalid={!!infoErrors.email}
                />
                {infoErrors.email ? (
                  <p className="text-xs text-destructive" role="alert">
                    {infoErrors.email}
                  </p>
                ) : null}
              </div>
            </form>
          ) : null}

          {isCalendlyStep ? (
            <div className="flex h-full min-h-0 flex-col justify-center bg-background px-3 py-3 sm:px-6 sm:py-4">
              {/*
                Centered, capped column: native Calendly fields/dropdowns inherit this width,
                so options stay visually contained without iframe CSS.
              */}
              <div className="mx-auto flex h-full min-h-0 w-full max-w-[20.5rem] flex-col overflow-hidden rounded-sm border border-border/55 bg-[#14110F] shadow-[inset_0_1px_0_color-mix(in_oklab,var(--foreground)_6%,transparent)] sm:max-w-md">
                <CalendlyInlineEmbed
                  key={`${prefill.email}-${prefill.name}`}
                  lazy={false}
                  prefill={prefill}
                  fill
                />
              </div>
            </div>
          ) : null}
        </div>

        <div
          className={cn(
            "flex shrink-0 items-center justify-between gap-3 border-t border-border/60",
            isCalendlyStep ? "px-4 py-2.5 sm:px-5 sm:py-3" : "px-5 py-4 sm:px-6",
          )}
        >
          {step > 1 ? (
            <Button
              type="button"
              variant="ghost"
              className="gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
          ) : (
            <span />
          )}
          {step < 2 ? (
            <Button
              type="submit"
              form="booking-info-form"
              className="h-11 bg-flame px-6 font-semibold text-background shadow-flame hover:bg-flame/90"
            >
              Continue
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <p className="text-xs text-muted-foreground">Scheduling stays on this page</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
