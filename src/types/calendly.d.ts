export type CalendlyPrefill = {
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  customAnswers?: Record<string, string>;
};

export type CalendlyUtm = {
  utmCampaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmContent?: string;
  utmTerm?: string;
  salesforce_uuid?: string;
};

export type CalendlyInlineOptions = {
  url: string;
  parentElement: HTMLElement;
  prefill?: CalendlyPrefill;
  utm?: CalendlyUtm;
  resize?: boolean;
};

export type CalendlyPopupOptions = {
  url: string;
  prefill?: CalendlyPrefill;
  utm?: CalendlyUtm;
};

export type CalendlyApi = {
  initInlineWidget: (options: CalendlyInlineOptions) => void;
  initPopupWidget: (options: CalendlyPopupOptions) => void;
  closePopupWidget?: () => void;
};

declare global {
  interface Window {
    Calendly?: CalendlyApi;
  }
}

export {};
