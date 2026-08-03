import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "@/auth/AuthProvider";
import { ProtectedRoute } from "@/auth/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";
import { AdminPage } from "@/pages/AdminPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { SignupPage } from "@/pages/auth/SignupPage";
import { DashboardPage } from "@/pages/DashboardPage";
import IncinerateLandingPage from "@/pages/incinerate/IncinerateLandingPage";
import { LogoutPage } from "@/pages/LogoutPage";
import { NotAuthorizedPage } from "@/pages/NotAuthorizedPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { OneRMPerformancePage } from "@/pages/1rm-performance/OneRMPerformancePage";
import { KalosSthenosPage } from "@/pages/kalos-sthenos/KalosSthenosPage";
import { MichaelsWellnessPage } from "@/pages/michaels-wellness/MichaelsWellnessPage";
import { SpryPrototypePage } from "@/pages/spry-fitness/SpryPrototypePage";
import { TridentFitnessPage } from "@/pages/trident-fitness/TridentFitnessPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IncinerateLandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          {/* Prototype brand routes — untouched behavior */}
          <Route path="/trident" element={<TridentFitnessPage />} />
          <Route path="/trident/" element={<TridentFitnessPage />} />
          <Route path="/1rm-performance" element={<OneRMPerformancePage />} />
          <Route path="/1rm-performance/" element={<OneRMPerformancePage />} />
          <Route path="/spry" element={<SpryPrototypePage />} />
          <Route path="/spry/" element={<SpryPrototypePage />} />
          <Route path="/spry-fitness-prototype" element={<SpryPrototypePage />} />
          <Route path="/spry-fitness-prototype/" element={<SpryPrototypePage />} />
          <Route path="/kalos-sthenos" element={<KalosSthenosPage />} />
          <Route path="/kalos-sthenos/" element={<KalosSthenosPage />} />
          <Route path="/kalos" element={<KalosSthenosPage />} />
          <Route path="/kalos/" element={<KalosSthenosPage />} />
          <Route path="/michaels-wellness" element={<MichaelsWellnessPage />} />
          <Route path="/michaels-wellness/" element={<MichaelsWellnessPage />} />
          <Route path="/michaels-wellness-center" element={<MichaelsWellnessPage />} />
          <Route path="/michaels-wellness-center/" element={<MichaelsWellnessPage />} />
          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/client/dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="/unauthorized" element={<NotAuthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster theme="dark" position="top-left" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}
