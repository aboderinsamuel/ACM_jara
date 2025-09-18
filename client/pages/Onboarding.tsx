import { useState } from "react";
import { toast } from "sonner";
// Local mode: store onboarding data in localStorage

type SocialLink = { url: string };

export default function Onboarding() {
  const [displayName, setDisplayName] = useState("Samuel Oluwaseun");
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState<SocialLink[]>([
    { url: "https://twitter.com/yourusername" },
  ]);
  const [loading, setLoading] = useState(false);

  const addLink = () => setLinks((l) => [...l, { url: "" }]);
  const removeLink = (i: number) =>
    setLinks((l) => l.filter((_, idx) => idx !== i));
  const updateLink = (i: number, url: string) =>
    setLinks((l) => l.map((v, idx) => (idx === i ? { url } : v)));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        displayName,
        bio,
        links,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("creator_profile", JSON.stringify(data));
      toast.success("Profile saved locally");
    } catch (err: any) {
      console.error("Onboarding submit failed:", err);
      toast.error(err.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1512429330140-8a4240fcb711?q=80&w=2000&auto=format&fit=crop"
          alt=""
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
      </div>

      <div className="px-4 sm:px-8 lg:px-12 py-10">
        <div className="max-w-2xl mx-auto bg-black/70 backdrop-blur rounded-lg p-6 sm:p-8 ring-1 ring-white/10">
          <h1 className="text-2xl font-bold">Create Your Creator Profile</h1>
          <p className="text-white/70 mt-1">
            Let's set up your creator profile to start monetizing your content
          </p>

          <form onSubmit={submit} className="grid gap-5 mt-6">
            <div>
              <label className="block text-sm text-white/70">
                Display Name *
              </label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="mt-1 w-full rounded bg-white/5 px-4 py-3 ring-1 ring-white/10"
                placeholder="Display Name"
              />
              <div className="text-xs text-white/50 mt-1">
                This will be your public display name
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded bg-white/5 px-4 py-3 ring-1 ring-white/10"
                placeholder="Tell your fans about yourself..."
              />
              <div className="text-xs text-white/50 mt-1">
                Optional: Share a bit about yourself
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70">
                Social Links
              </label>
              <div className="grid gap-3 mt-2">
                {links.map((l, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={l.url}
                      onChange={(e) => updateLink(i, e.target.value)}
                      className="flex-1 rounded bg-white/5 px-4 py-3 ring-1 ring-white/10"
                      placeholder="https://twitter.com/yourusername"
                    />
                    <button
                      type="button"
                      onClick={() => removeLink(i)}
                      className="rounded bg-white/10 px-3 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLink}
                  className="justify-self-start rounded bg-white/10 px-4 py-2 text-sm"
                >
                  + Add Social Link
                </button>
              </div>
            </div>

            <div className="rounded bg-white/5 p-4 text-white/80">
              <div className="font-semibold mb-1">What happens next?</div>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>You'll be able to create payment links for your content</li>
                <li>
                  Fans can support you with tips, memberships, and purchases
                </li>
                <li>You'll get access to analytics and earnings reports</li>
                <li>You can customize your creator page and landing pages</li>
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" className="rounded bg-white/10 px-4 py-3">
                Skip for Now
              </button>
              <button
                disabled={loading}
                className="rounded bg-primary px-5 py-3 font-semibold disabled:opacity-60"
              >
                {loading ? "Creating…" : "Create Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
