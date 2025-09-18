import { PropsWithChildren } from "react";
import SiteHeader from "./SiteHeader";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <main className="pt-16">{children}</main>
      <footer className="px-4 sm:px-8 max-w-7xl mx-auto py-12 text-white/50 text-sm">
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <span>Questions? Contact us.</span>
          <span>Privacy</span>
          <span>Help Center</span>
          <span>Jobs</span>
          <span>Cookie Preferences</span>
        </div>
        <div className="mt-6">© {new Date().getFullYear()} JARA</div>
      </footer>
    </div>
  );
}
