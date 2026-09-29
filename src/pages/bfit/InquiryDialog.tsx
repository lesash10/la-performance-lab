import { useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const GOALS = [
  "Lose fat",
  "Build muscle",
  "Get stronger",
  "Move better",
  "Build consistency",
] as const;
const PLACES = ["Home", "Gym", "Both"] as const;
const BLOCKERS = ["Time", "Consistency", "Knowing what to do", "Nutrition", "Other"] as const;

type Goal = (typeof GOALS)[number];
type Place = (typeof PLACES)[number];
type Blocker = (typeof BLOCKERS)[number];

type InquiryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const STEPS = [
  {
    kicker: "01",
    title: "What's your main goal?",
    options: GOALS,
  },
  {
    kicker: "02",
    title: "Where do you currently train?",
    options: PLACES,
  },
  {
    kicker: "03",
    title: "What's the biggest thing getting in your way?",
    options: BLOCKERS,
  },
] as const;

export function InquiryDialog({ open, onOpenChange }: InquiryDialogProps) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [place, setPlace] = useState<Place | null>(null);
  const [blocker, setBlocker] = useState<Blocker | null>(null);

  const reset = () => {
    setStep(0);
    setGoal(null);
    setPlace(null);
    setBlocker(null);
  };

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) reset();
  };

  const selections = [goal, place, blocker] as const;
  const setSelection = (value: string) => {
    if (step === 0) setGoal(value as Goal);
    if (step === 1) setPlace(value as Place);
    if (step === 2) setBlocker(value as Blocker);
  };

  const current = STEPS[step];
  const selected = selections[step] ?? null;
  const finished = step >= STEPS.length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "bfit bfit-dialog top-0 right-0 left-auto flex h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-[#f3f1ec] p-0 text-[#141414] shadow-none",
          "sm:w-[min(34rem,100vw)]",
          "data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100",
        )}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5 pr-16 sm:px-8">
          <p className="text-[0.72rem] font-medium tracking-[0.22em] text-[#8a8178] uppercase">
            bFIT
          </p>
          <p className="text-[0.72rem] tracking-[0.16em] text-[#5c574f] uppercase">
            {finished ? "Next step" : `${current.kicker} / 03`}
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-8 sm:px-8">
          {finished ? (
            <div>
              <DialogTitle className="max-w-[14ch] text-[clamp(2.4rem,6vw,3.4rem)] leading-[0.92] font-medium tracking-[-0.045em] text-[#141414] uppercase">
                Thanks. Here's the next step.
              </DialogTitle>
              <DialogDescription className="mt-6 max-w-[36ch] text-base leading-relaxed text-[#3c3934]">
                On the live site, this is where Brook would continue into bFIT. Nothing you selected
                was sent. This pass only shows how the question can work.
              </DialogDescription>
              <dl className="mt-10 border-t border-black/10">
                <SummaryRow label="Goal" value={goal} />
                <SummaryRow label="Training" value={place} />
                <SummaryRow label="In the way" value={blocker} />
              </dl>
            </div>
          ) : (
            <div>
              <DialogTitle className="max-w-[16ch] text-[clamp(2.1rem,5vw,3rem)] leading-[0.95] font-medium tracking-[-0.04em] text-[#141414] uppercase">
                {current.title}
              </DialogTitle>
              <DialogDescription className="mt-4 text-sm text-[#5c574f]">
                A short check so the next step fits the person, instead of one generic join page.
              </DialogDescription>
              <div className="mt-8 grid gap-2" role="group" aria-label={current.title}>
                {current.options.map((option) => {
                  const isSelected = selected === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelection(option)}
                      className={cn(
                        "min-h-12 border px-4 text-left text-[0.95rem] transition-colors",
                        isSelected
                          ? "border-[#141414] bg-[#141414] text-[#f3f1ec]"
                          : "border-black/15 bg-transparent text-[#141414] hover:border-black/40",
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-black/10 px-6 py-5 sm:px-8">
          {finished ? (
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="min-h-12 w-full bg-[#141414] px-5 text-[0.78rem] font-medium tracking-[0.16em] text-[#f3f1ec] uppercase"
            >
              Close
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep((value) => Math.max(0, value - 1))}
                disabled={step === 0}
                className="min-h-12 px-2 text-[0.78rem] tracking-[0.14em] text-[#5c574f] uppercase disabled:opacity-30"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!selected}
                onClick={() => setStep((value) => value + 1)}
                className="min-h-12 bg-[#141414] px-6 text-[0.78rem] font-medium tracking-[0.16em] text-[#f3f1ec] uppercase disabled:opacity-30"
              >
                Continue
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SummaryRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-black/10 py-4">
      <dt className="text-[0.72rem] tracking-[0.16em] text-[#8a8178] uppercase">{label}</dt>
      <dd className="text-right text-base">{value}</dd>
    </div>
  );
}
