import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PagesList from "./pages/Pages";
import CreateJaraPage from "./pages/CreateJaraPage";
import JaraPage from "./pages/JaraPage";
// import PaymentLinks from "./pages/PaymentLinks";
import Subscriptions from "./pages/Subscriptions";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PublicPage from "./pages/PublicPage";
import Settings from "./pages/Settings";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Onboarding from "./pages/Onboarding";
import ExperienceSurvey from "./pages/ExperienceSurvey";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import UploadVideo from "./pages/UploadVideo";
import Payments from "./pages/Payments";
import AIGenerator from "./pages/AIGenerator";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

import Layout from "@/components/layout/Layout";
import { AuthProvider, RequireAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { preloadLink, discoverLocalPosters } from "@/lib/assets";

const App = () => {
  useEffect(() => {
    // Preload critical assets: hero trailer and discovered local posters
    const cleanups: Array<() => void> = [];
    cleanups.push(preloadLink("/videos/trailer1.mp4", "video", "video/mp4"));
    (async () => {
      try {
        const posters = await discoverLocalPosters(24);
        // Preload discovered posters and cache list for use across pages
        posters.forEach((p) => {
          cleanups.push(preloadLink(p, "image"));
        });
        try {
          localStorage.setItem(
            "available_posters_v2",
            JSON.stringify({ version: 4, list: posters }),
          );
        } catch {}
      } catch {}
    })();
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Layout>
              <Routes>
                {/* Public landing is the root */}
                <Route path="/" element={<Landing />} />
                {/* App main page after onboarding */}
                <Route
                  path="/home"
                  element={
                    <RequireAuth>
                      <Home />
                    </RequireAuth>
                  }
                />
                <Route path="/pages" element={<PagesList />} />
                <Route path="/pages/create" element={<CreateJaraPage />} />
                <Route path="/u/:slug" element={<JaraPage />} />
                <Route
                  path="/subscriptions"
                  element={
                    <RequireAuth>
                      <Subscriptions />
                    </RequireAuth>
                  }
                />
                <Route path="/pay/:slug" element={<PaymentPage />} />
                <Route path="/pay/success" element={<PaymentSuccess />} />
                <Route path="/p/:slug" element={<PublicPage />} />
                <Route path="/settings" element={<Settings />} />
                {/* Tools */}
                <Route path="/ai" element={<AIGenerator />} />
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/onboarding"
                  element={
                    <RequireAuth>
                      <Onboarding />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/payments"
                  element={
                    <RequireAuth>
                      <Payments />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/movies"
                  element={
                    <RequireAuth>
                      <Movies />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/videos/upload"
                  element={
                    <RequireAuth>
                      <UploadVideo />
                    </RequireAuth>
                  }
                />
                <Route path="/survey" element={<ExperienceSurvey />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
