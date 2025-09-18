import Placeholder from "@/components/common/Placeholder";

export default function Login() {
  return (
    <Placeholder
      title="Login"
      description="Authenticate with Supabase. On success, session is stored and used for Authorization headers."
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
          Login
        </button>
        <a
          href="/auth/register"
          className="text-sm text-white/70 hover:underline"
        >
          Create account
        </a>
      </form>
    </Placeholder>
  );
}
