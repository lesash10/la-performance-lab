/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_SUPABASE_PROJECT_ID?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_CALENDLY_URL?: string;
  readonly VITE_CALENDLY_ENABLED?: string;
  readonly VITE_CALENDLY_PRIMARY_COLOR?: string;
  readonly VITE_CALENDLY_TEXT_COLOR?: string;
  readonly VITE_CALENDLY_BACKGROUND_COLOR?: string;
  readonly VITE_CALENDLY_HIDE_GDPR_BANNER?: string;
  readonly VITE_CALENDLY_HIDE_EVENT_TYPE_DETAILS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
