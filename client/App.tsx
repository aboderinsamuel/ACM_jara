import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import PagesList from "./pages/Pages";
import CreateJaraPage from "./pages/CreateJaraPage";
import JaraPage from "./pages/JaraPage";
import PaymentLinks from "./pages/PaymentLinks";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PublicPage from "./pages/PublicPage";
import Settings from "./pages/Settings";
import AIGenerator from "./pages/AIGenerator";
import AIGeneratedPage from "./pages/AIGeneratedPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

const queryClient = new QueryClient();

import Layout from "@/components/layout/Layout";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pages" element={<PagesList />} />
            <Route path="/pages/create" element={<CreateJaraPage />} />
            <Route path="/u/:slug" element={<JaraPage />} />
            <Route path="/payment-links" element={<PaymentLinks />} />
            <Route path="/pay/:slug" element={<PaymentPage />} />
            <Route path="/pay/success" element={<PaymentSuccess />} />
            <Route path="/p/:slug" element={<PublicPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/ai" element={<AIGenerator />} />
            <Route path="/ai/:slug" element={<AIGeneratedPage />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
