import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1505685296765-3a2736de412f?q=80&auto=format&fit=crop&w=2000"
          alt=""
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
      </div>

      <div className="px-4 sm:px-8 lg:px-12 py-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Monetize your content like a pro
          </h1>
          <p className="text-white/80 mt-4 text-lg">
            Create pages, accept tips and memberships, and track analytics—all
            in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/auth/login"
              className="rounded bg-primary px-6 py-3 font-semibold"
            >
              Sign In
            </Link>
            <Link
              to="/auth/register"
              className="rounded bg-white/10 px-6 py-3 font-semibold ring-1 ring-white/20"
            >
              Create an account
            </Link>
          </div>
          <div className="mt-6 text-white/60 text-sm">
            New users will take a quick survey after sign up so we can tailor
            your dashboard.
          </div>
        </div>
      </div>
    </div>
  );
}
