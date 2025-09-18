import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerLocalUser } from "@shared/local-auth";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export default function Register() {
  const nav = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, user } = await registerLocalUser(email, password);
      // Save auth state
      signIn(user.email, token, user.id as string | undefined);
      // After sign up, send new users to survey unless they've done it on this device
      toast.success("Account created. Welcome!");
      const done = localStorage.getItem("experience_survey_done") === "1";
      nav(done ? "/home" : "/survey");
    } catch (err: any) {
      toast.error(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    toast.info("Google sign-up is not enabled with the custom API yet.");
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=2000&auto=format&fit=crop"
          alt=""
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
      </div>

      <div className="px-4 sm:px-8 lg:px-12 py-12">
        <div className="max-w-md mx-auto bg-black/70 backdrop-blur rounded-lg p-6 sm:p-8 ring-1 ring-white/10">
          <h1 className="text-2xl font-bold mb-2">Create account</h1>
          <p className="text-white/70 mb-6">We’ll send a confirmation email.</p>
          <form onSubmit={onSubmit} className="grid gap-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="rounded bg-white/5 px-4 py-3 ring-1 ring-white/10"
              placeholder="Email"
              autoComplete="email"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="rounded bg-white/5 px-4 py-3 ring-1 ring-white/10"
              placeholder="Password"
              autoComplete="new-password"
              minLength={6}
            />
            <button
              disabled={loading}
              className="rounded bg-primary px-5 py-3 font-semibold disabled:opacity-60"
            >
              {loading ? "Signing up…" : "Sign Up"}
            </button>
          </form>
          <div className="my-4 flex items-center gap-3 text-white/60">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-wide">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <button
            onClick={signUpWithGoogle}
            disabled={oauthLoading}
            className="w-full rounded bg-white text-black px-5 py-3 font-semibold disabled:opacity-60"
          >
            {oauthLoading ? "Redirecting…" : "Continue with Google"}
          </button>
          <div className="mt-4 text-sm text-white/70">
            Already have an account?{" "}
            <Link className="text-white hover:underline" to="/auth/login">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
