import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginLocalUser } from "@shared/local-auth";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export default function Login() {
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
      const { token, user } = await loginLocalUser(email, password);
      signIn(user.email, token, user.id as string | undefined);
      toast.success("Welcome back!");
      const done = localStorage.getItem("experience_survey_done") === "1";
      nav(done ? "/home" : "/survey");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    toast.info("Google sign-in is not enabled with the custom API yet.");
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1517604931442-7e88f9a7f7fa?q=80&w=2000&auto=format&fit=crop"
          alt=""
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
      </div>

      <div className="px-4 sm:px-8 lg:px-12 py-12">
        <div className="max-w-md mx-auto bg-black/70 backdrop-blur rounded-lg p-6 sm:p-8 ring-1 ring-white/10">
          <h1 className="text-2xl font-bold mb-2">Sign In</h1>
          <p className="text-white/70 mb-6">
            Enter your credentials to continue.
          </p>
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
              autoComplete="current-password"
            />
            <button
              disabled={loading}
              className="rounded bg-primary px-5 py-3 font-semibold disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <div className="my-4 flex items-center gap-3 text-white/60">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-wide">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <button
            onClick={signInWithGoogle}
            disabled={oauthLoading}
            className="w-full rounded bg-white text-black px-5 py-3 font-semibold disabled:opacity-60"
          >
            {oauthLoading ? "Redirecting…" : "Continue with Google"}
          </button>
          <div className="mt-4 text-sm text-white/70">
            New to Jara?{" "}
            <Link className="text-white hover:underline" to="/auth/register">
              Sign up now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
