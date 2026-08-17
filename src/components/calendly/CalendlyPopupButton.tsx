import { useState } from "react";
import { toast } from "sonner";

import { Button, type ButtonProps } from "@/components/ui/button";
import { getCalendlyConfig, openCalendlyPopup } from "@/lib/calendly";
import { useCalendlyScript } from "@/hooks/useCalendlyScript";
import type { CalendlyPrefill, CalendlyUtm } from "@/types/calendly";
import { cn } from "@/lib/utils";

type CalendlyPopupButtonProps = Omit<ButtonProps, "onClick"> & {
  prefill?: CalendlyPrefill;
  utm?: CalendlyUtm;
  /** Eagerly start loading Calendly assets (useful near CTAs). */
  preload?: boolean;
};

export function CalendlyPopupButton({
  children,
  className,
  prefill,
  utm,
  preload = false,
  disabled,
  ...props
}: CalendlyPopupButtonProps) {
  const config = getCalendlyConfig();
  const [intent, setIntent] = useState(false);
  const { ready, loading } = useCalendlyScript(Boolean(config.enabled && (preload || intent)));
  const [opening, setOpening] = useState(false);

  const handleClick = async () => {
    setIntent(true);
    setOpening(true);
    try {
      await openCalendlyPopup({ prefill, utm });
    } catch (err) {
      console.error("[Calendly] popup failed", err);
      toast.error("Scheduler unavailable", {
        description: "Stay on this page and try again in a moment.",
      });
    } finally {
      setOpening(false);
    }
  };

  const busy = opening || (intent && loading && !ready);

  return (
    <Button
      type="button"
      {...props}
      className={cn(className)}
      disabled={disabled || busy || !config.enabled}
      aria-busy={busy}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}
