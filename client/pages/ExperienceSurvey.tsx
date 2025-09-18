import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { apiAuth } from "@shared/api"; // API calls are disabled for now per request
import { toast } from "sonner";

type Level = "beginner" | "intermediate" | "advanced";

const platforms = [
  {
    id: "youtube",
    name: "YouTube",
    logo: "https://www.svgrepo.com/show/475700/youtube-color.svg",
  },
  {
    id: "tiktok",
    name: "TikTok",
    logo: "https://www.svgrepo.com/show/473775/tiktok-color.svg",
  },
  {
    id: "instagram",
    name: "Instagram",
    logo: "https://www.svgrepo.com/show/521730/insta.svg",
  },
  {
    id: "twitter",
    name: "X / Twitter",
    logo: "https://www.svgrepo.com/show/521296/x.svg",
  },
  {
    id: "twitch",
    name: "Twitch",
    logo: "https://www.svgrepo.com/show/475661/twitch-color.svg",
  },
];

export default function ExperienceSurvey() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState<Level | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const canNext = useMemo(() => {
    if (step === 0) return !!level;
    if (step === 1) return selected.length > 0;
    return true;
  }, [step, level, selected]);

  useEffect(() => {
    // Skip if already completed on this device
    const done = localStorage.getItem("experience_survey_done");
    if (done === "1") {
      // If user already completed, bounce to dashboard
      nav("/home", { replace: true });
    }
  }, [nav]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const submit = async () => {
    setLoading(true);
    try {
      // Determine creator type from selected platforms
      const isCreator = selected.some((p) =>
        ["youtube", "tiktok", "instagram", "twitch"].includes(p),
      );
      const creatorType = isCreator ? "creator" : "producer";
      const payload = { level, platforms: selected, creatorType };
      localStorage.setItem("experience_survey", JSON.stringify(payload));
      localStorage.setItem("experience_survey_done", "1");
      toast.success("Thanks! Your dashboard will be personalized.");
      nav("/home");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&auto=format&fit=crop&w=2000"
          alt=""
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
      </div>

      <div className="px-4 sm:px-8 lg:px-12 py-10">
        <div className="max-w-3xl mx-auto bg-black/70 backdrop-blur rounded-lg ring-1 ring-white/10 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Tell us about your creator journey
            </h1>
            <p className="text-white/70 mt-1">
              We'll personalize analytics and tips for your experience level.
            </p>

            {/* Steps indicator */}
            <div className="flex items-center gap-2 mt-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i <= step ? "bg-primary w-20" : "bg-white/20 w-12"
                  }`}
                />
              ))}
            </div>

            {/* Step 0: Experience level */}
            {step === 0 && (
              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                {[
                  {
                    id: "beginner",
                    title: "Absolute Beginner",
                    desc: "New to filmmaking or social media",
                  },
                  {
                    id: "intermediate",
                    title: "Intermediate",
                    desc: "Some experience, growing steadily",
                  },
                  {
                    id: "advanced",
                    title: "Very Experienced",
                    desc: "Pro creator or full-time",
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setLevel(opt.id as Level)}
                    className={`text-left rounded-lg p-4 ring-1 transition ${
                      level === opt.id
                        ? "ring-primary bg-primary/10"
                        : "ring-white/10 hover:bg-white/5"
                    }`}
                  >
                    <div className="font-semibold">{opt.title}</div>
                    <div className="text-white/70 text-sm mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 1: Platforms */}
            {step === 1 && (
              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                {platforms.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => toggle(p.id)}
                    className={`flex items-center gap-3 rounded-lg p-4 ring-1 transition ${
                      selected.includes(p.id)
                        ? "ring-primary bg-primary/10"
                        : "ring-white/10 hover:bg-white/5"
                    }`}
                  >
                    <img src={p.logo} alt="" className="h-6 w-6" />
                    <span className="font-medium">{p.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Confirmation */}
            {step === 2 && (
              <div className="mt-6">
                <div className="text-white/80">You're set as:</div>
                <div className="text-lg font-semibold capitalize mt-1">
                  {level}
                </div>
                <div className="text-white/80 mt-4">Platforms:</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selected.map((id) => {
                    const p = platforms.find((x) => x.id === id)!;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm"
                      >
                        <img src={p.logo} className="h-4 w-4" /> {p.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div className="mt-8 flex items-center gap-3">
              {step > 0 && (
                <button
                  className="rounded bg-white/10 px-4 py-2"
                  onClick={() => setStep((s) => s - 1)}
                >
                  Back
                </button>
              )}
              {step < 2 && (
                <button
                  disabled={!canNext}
                  className="rounded bg-primary px-5 py-2 font-semibold disabled:opacity-60"
                  onClick={() => canNext && setStep((s) => s + 1)}
                >
                  Next
                </button>
              )}
              {step === 2 && (
                <button
                  disabled={loading}
                  className="rounded bg-primary px-5 py-2 font-semibold disabled:opacity-60"
                  onClick={submit}
                >
                  {loading ? "Saving…" : "Finish"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
