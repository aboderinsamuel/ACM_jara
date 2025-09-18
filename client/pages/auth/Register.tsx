import Placeholder from "@/components/common/Placeholder";

export default function Register() {
  return (
    <Placeholder
      title="Create Account"
      description="Sign up with Supabase; verify email OTP; then redirect to Dashboard."
    >
      <form className="grid gap-4 max-w-sm">
        <input
          className="rounded bg-white/5 px-4 py-3 ring-1 ring-white/10"
          placeholder="Email"
        />
        <input
          className="rounded bg-white/5 px-4 py-3 ring-1 ring-white/10"
          placeholder="Password"
          type="password"
        />
        <button className="rounded bg-primary px-5 py-3 font-semibold">
          Register
        </button>
        <a href="/auth/login" className="text-sm text-white/70 hover:underline">
          Already have an account?
        </a>
      </form>
    </Placeholder>
  );
}
