import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PromoBanner } from "@/components/PromoBanner";
import { Footer } from "@/components/Footer";
import { LandingPage } from "@/pages/LandingPage";
import { VideoPage } from "@/pages/VideoPage";
import { ImagePage } from "@/pages/ImagePage";
import { FaceSwapPage } from "@/pages/FaceSwapPage";
import { LoginPage } from "@/pages/LoginPage";
import { AvatarPage } from "@/pages/AvatarPage";
import { TemplatesPage } from "@/pages/TemplatesPage";
import { GenerationPage } from "@/pages/GenerationPage";
import { AdminTemplateCreatePage } from "@/pages/AdminTemplateCreatePage";
import { AdminMetricsPage } from "@/pages/AdminMetricsPage";
import { BillingPage } from "@/pages/BillingPage";
import { PricingPage } from "@/pages/PricingPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { RefundPage } from "@/pages/RefundPage";
import { TermsPage } from "@/pages/TermsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen">
        {/* Side HUD rails */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-y-0 left-0 z-30 hidden w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent lg:block"
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-y-0 right-0 z-30 hidden w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent lg:block"
        />
        <PromoBanner />
        <Navbar />
        <main className="relative">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/video" element={<VideoPage />} />
            <Route path="/image" element={<ImagePage />} />
            <Route path="/face-swap" element={<FaceSwapPage />} />
            <Route path="/user/templates" element={<TemplatesPage />} />
            <Route path="/generation/:id" element={<GenerationPage />} />
            <Route path="/user/avatar" element={<AvatarPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route
              path="/admin/template/create"
              element={<AdminTemplateCreatePage />}
            />
            <Route path="/admin/metrics" element={<AdminMetricsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/refund" element={<RefundPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
