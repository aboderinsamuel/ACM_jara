import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { api, type IPaymentLink as PaymentLink } from "@/lib/api";
import { useCreator } from "@/hooks/use-creator";
import {
  Edit,
  ExternalLink,
  Eye,
  Globe,
  Lock,
  Trash2,
  Copy,
  Plus,
  DollarSign,
  CreditCard,
} from "lucide-react";

export default function Movies() {
  const {
    creator,
    isLoading: creatorLoading,
    error: creatorError,
  } = useCreator();
  const navigate = useNavigate();
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishingLinks, setPublishingLinks] = useState<Set<string>>(
    new Set(),
  );

  const [formData, setFormData] = useState({
    type: "product" as PaymentLink["type"],
    title: "",
    description: "",
    price: "",
    currency: "USD",
    image_url: "",
    successMessage: "67889jara",
  });

  useEffect(() => {
    if (creator) loadPaymentLinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creator, filter]);

  const showCreatorSetup = !creatorLoading && !creator;

  const loadPaymentLinks = async () => {
    if (!creator) return;
    try {
      setIsLoading(true);
      const published =
        filter === "published" ? true : filter === "draft" ? false : undefined;
      const res = await api.getPaymentLinks(creator.id, { published });
      setPaymentLinks(res.paymentLinks || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load movies");
      setPaymentLinks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const linkData = {
        ...formData,
        price: parseFloat(formData.price),
        isPublished: true,
      } as any;
      const res = await api.createPaymentLink(linkData);
      setPaymentLinks((prev) => [res.paymentLink, ...prev]);
      const generatedLink = `${window.location.origin}/pay/${res.paymentLink.slug}`;
      toast.success(`Movie added! ${generatedLink}`);
      resetForm();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save movie");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: "product",
      title: "",
      description: "",
      price: "",
      currency: "USD",
      image_url: "",
      successMessage: "67889jara",
    });
  };

  const handleTogglePublish = async (linkId: string, isPublished: boolean) => {
    setPublishingLinks((prev) => new Set(prev).add(linkId));
    try {
      await api.publishPaymentLink(linkId, !isPublished);
      setPaymentLinks((prev) =>
        prev.map((l) =>
          l.id === linkId ? { ...l, isPublished: !isPublished } : l,
        ),
      );
    } catch (e) {
      toast.error("Failed to update status");
    } finally {
      setPublishingLinks((prev) => {
        const n = new Set(prev);
        n.delete(linkId);
        return n;
      });
    }
  };

  const handleCopyLink = async (slug: string) => {
    const link = `${window.location.origin}/pay/${slug}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = link;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      toast.success("Link copied");
    }
  };

  const filtered = useMemo(() => paymentLinks, [paymentLinks]);

  if (isLoading && !showCreatorSetup) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="text-center text-white/80">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Loading movies…
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 lg:px-12 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Movies</h1>
            <p className="text-white/70">
              Create and manage your movies for rental
            </p>
          </div>
          <Button
            onClick={() => {
              const el = document.getElementById("create-movie");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Plus className="w-4 h-4" /> Add Movie
          </Button>
        </div>

        {showCreatorSetup ? (
          <div className="rounded-lg border border-white/10 p-6 mb-8 bg-white/5">
            <h2 className="text-xl font-semibold">
              Finish setting up your creator profile
            </h2>
            <p className="text-white/70 mt-1">
              We couldn't load a creator profile
              {creatorError ? `: ${creatorError}` : "."} You can create one now
              to start adding movies.
            </p>
            <div className="mt-4 flex gap-3">
              <Button onClick={() => navigate("/onboarding")}>
                Create Profile
              </Button>
              <Link
                to="/videos/upload"
                className="rounded bg-white/10 px-4 py-2"
              >
                Upload Video
              </Link>
            </div>
          </div>
        ) : null}

        <div className="mb-6 flex gap-2 bg-white/5 p-1 rounded-lg w-fit">
          {[
            { id: "all", label: "All Links" },
            { id: "published", label: "Published" },
            { id: "draft", label: "Drafts" },
          ].map((t: any) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-4 py-2 rounded-md text-sm ${filter === t.id ? "bg-white/10 text-white" : "text-white/80 hover:text-white"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((link) => (
              <Card key={link.id} className="group overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-purple-100/10 to-blue-100/10 rounded-b-none overflow-hidden relative">
                  {link.image_url || link.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={(link.image_url || link.imageUrl)!}
                      alt={link.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white/70">
                      {link.title}
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${link.isPublished ? "bg-green-500/20 text-green-300" : "bg-white/10 text-white/80"}`}
                    >
                      {link.isPublished ? (
                        <Globe className="w-3 h-3 mr-1" />
                      ) : (
                        <Lock className="w-3 h-3 mr-1" />
                      )}
                      {link.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                <CardContent className="space-y-3">
                  <div>
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
                    <div className="text-right text-white/60">
                      <div>{link.totalRevenue || 0} earned</div>
                      <div>{link.totalTransactions || 0} transactions</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleTogglePublish(link.id, link.isPublished)
                      }
                      disabled={publishingLinks.has(link.id)}
                    >
                      {publishingLinks.has(link.id) ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : link.isPublished ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Globe className="w-4 h-4" />
                      )}
                      <span className="ml-1">
                        {publishingLinks.has(link.id)
                          ? "Updating…"
                          : link.isPublished
                            ? "Unpublish"
                            : "Publish"}
                      </span>
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          window.open(`/pay/${link.slug}`, "_blank")
                        }
                      >
                        <Eye className="w-4 h-4" /> Preview
                      </Button>
                      {link.isPublished && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(`/pay/${link.slug}`, "_blank")
                          }
                        >
                          <ExternalLink className="w-4 h-4" /> Live
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyLink(link.slug)}
                      >
                        <Copy className="w-4 h-4" /> Copy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full grid place-items-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {filter === "published"
                ? "No published movies"
                : filter === "draft"
                  ? "No draft movies"
                  : "No movies yet"}
            </h3>
            <p className="text-white/70 mb-6">
              {filter === "published"
                ? "Publish your first movie to start sharing."
                : filter === "draft"
                  ? "Add a new movie or check your published movies."
                  : "Add your first movie to start sharing your work."}
            </p>
            <a href="#create-movie">
              <Button>
                <Plus className="w-4 h-4" /> Add Your First Movie
              </Button>
            </a>
          </div>
        )}

        {/* Simple create form */}
        <div id="create-movie" className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle>Add Movie</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-white/80">Price</label>
                    <input
                      className="mt-1 w-full rounded bg-white/5 px-3 py-2 ring-1 ring-white/10"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, price: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/80">
                      Currency
                    </label>
                    <select
                      className="mt-1 w-full rounded bg-white/5 px-3 py-2 ring-1 ring-white/10"
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, currency: e.target.value }))
                      }
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="NGN">NGN</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/80">Title</label>
                  <input
                    className="mt-1 w-full rounded bg-white/5 px-3 py-2 ring-1 ring-white/10"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="Enter movie title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/80">
                    Description
                  </label>
                  <textarea
                    className="mt-1 w-full rounded bg-white/5 px-3 py-2 ring-1 ring-white/10"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your movie"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating…" : "Create Movie"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
