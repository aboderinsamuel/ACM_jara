import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api, type IPaymentLink as PaymentLink } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function JaraPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [landing, setLanding] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Local demo fallback content
  const demoLanding = useMemo(
    () => ({
      id: "demo-landing",
      slug: "demo",
      title: "Demo Creator",
      description:
        "Welcome to the demo creator page. Explore sample movies and try the flow.",
      isPublished: true,
      coverImageUrl: "/moviePosters/image1.webp",
      creator: {
        id: "demo-creator",
        name: "Demo Creator",
        bio: "Filmmaker | Storyteller | Explorer",
        image: "/ProfilePic/Netflix%20Profile%20Meme.jpg",
      },
      paymentLinks: [
        {
          id: "demo-pl-1",
          slug: "demo-movie-1",
          type: "rental",
          title: "Demo Movie One",
          description: "An exciting journey into the world of Jara.",
          price: 3.99,
          currency: "USD",
          imageUrl: "/moviePosters/image1.webp",
          isPublished: true,
        },
        {
          id: "demo-pl-2",
          slug: "demo-movie-2",
          type: "rental",
          title: "Demo Movie Two",
          description: "Another captivating story brought to life.",
          price: 4.99,
          currency: "USD",
          imageUrl: "/moviePosters/image1.webp",
          isPublished: true,
        },
      ],
    }),
    [],
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!slug) return;
        setIsLoading(true);
        // Serve local demo without API
        if (slug === "demo") {
          if (!mounted) return;
          setLanding(demoLanding);
          return;
        }
        const res = await api.getLandingPageBySlug(slug);
        if (!mounted) return;
        setLanding(res.landingPage);
      } catch (e) {
        console.error(e);
        // If slug explicitly requests demo, fall back locally
        if (slug === "demo") {
          if (!mounted) return;
          setLanding(demoLanding);
        } else {
          toast.error("Page not found");
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug, demoLanding]);

  const paymentLinks: PaymentLink[] = useMemo(() => {
    const links = (landing?.paymentLinks || []) as PaymentLink[];
    return links.filter((l) => l.isPublished);
  }, [landing]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="text-center text-white/80">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Loading page…
        </div>
      </div>
    );
  }

  if (!landing) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="text-white/80">This page isn’t available.</div>
      </div>
    );
  }

  const cover = landing.coverImageUrl || "/moviePosters/image1.webp";
  const avatar =
    landing.creator?.image || "/ProfilePic/Netflix%20Profile%20Meme.jpg";

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="relative h-56 sm:h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black" />
      </div>
      <div className="px-4 sm:px-8 lg:px-12 -mt-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar}
              alt=""
              className="h-24 w-24 rounded-full object-cover ring-2 ring-white/20"
            />
            <div className="pb-2">
              <h1 className="text-2xl sm:text-3xl font-bold">
                {landing.creator?.name || landing.title}
              </h1>
              <div className="text-white/70 text-sm">
                {landing.creator?.bio || landing.description}
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <p className="text-white/80">{landing.description || ""}</p>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">My Movies</h2>
            {paymentLinks.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {paymentLinks.map((link) => (
                  <Card key={link.id} className="overflow-hidden">
                    <div className="aspect-video bg-white/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {link.image_url || link.imageUrl ? (
                        <img
                          src={(link.image_url || link.imageUrl)!}
                          alt={link.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-white/60">
                          {link.title}
                        </div>
                      )}
                    </div>
                    <CardContent className="space-y-3 pt-4">
                      <div>
                        <div className="text-sm uppercase tracking-wide text-white/60">
                          {link.type?.replace("_", " ") || "product"}
                        </div>
                        <h3 className="font-semibold">{link.title}</h3>
                        <p className="text-sm text-white/70 line-clamp-2">
                          {link.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="font-semibold">
                            {link.currency} {link.price}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/pay/${link.slug}`)}
                        >
                          <ExternalLink className="w-4 h-4" /> Rent Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-white/70">No published movies yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
