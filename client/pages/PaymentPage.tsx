import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { randomPoster } from "@/lib/posters";
import {
  Bitcoin,
  CreditCard,
  DollarSign,
  Globe,
  Loader,
  AlertCircle,
  CheckCircle,
  User,
} from "lucide-react";
import { toast } from "sonner";

type PaymentLinkDetails = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
  successMessage?: string;
  creator?: { name?: string; bio?: string; jaraPageSlug?: string };
};

export default function PaymentPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [paymentLink, setPaymentLink] = useState<PaymentLinkDetails | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    currency: "USD",
  });
  const [paymentMethod, setPaymentMethod] = useState<"fiat" | "crypto">("fiat");
  const [cryptoCurrency, setCryptoCurrency] = useState("BTC");
  const [cryptoPaymentData, setCryptoPaymentData] = useState<any>(null);

  useEffect(() => {
    if (slug) void loadPaymentLink();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (cryptoPaymentData?.payment_id) {
      const poll = setInterval(async () => {
        try {
          const status = await api.getCryptoPaymentStatus(
            cryptoPaymentData.payment_id,
          );
          if (status.status === "finished" || status.status === "confirmed") {
            clearInterval(poll);
            navigate("/pay/success", {
              state: { message: paymentLink?.successMessage || "67889jara" },
            });
          }
        } catch {}
      }, 10000);
      return () => clearInterval(poll);
    }
  }, [cryptoPaymentData, paymentLink, navigate]);

  const loadPaymentLink = async () => {
    try {
      setIsLoading(true);
      const res = await api.getPaymentLinkDetails(slug!);
      setPaymentLink(res.paymentLink as PaymentLinkDetails);
    } catch (e) {
      console.error(e);
      toast.error("Payment link not found or not available");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentLink) return;
    try {
      setIsProcessing(true);
      if (paymentMethod === "fiat") {
        const res = await api.initiatePayment({
          paymentLinkId: paymentLink.id,
          customerEmail: customerData.email,
          customerName: customerData.name,
          customerCurrency: customerData.currency,
          redirectUrl: `${window.location.origin}/pay/success`,
        });
        if (res.payment_url) {
          window.location.href = res.payment_url;
        } else {
          throw new Error("No payment URL provided");
        }
      } else {
        const res = await api.createCryptoPayment({
          paymentLinkId: paymentLink.id,
          customerEmail: customerData.email,
          customerName: customerData.name,
          payCurrency: cryptoCurrency,
          successUrl: `${window.location.origin}/pay/success`,
          cancelUrl: window.location.href,
          orderId: `payment_${Date.now()}`,
          orderDescription: `Payment for ${paymentLink.title}`,
        });
        setCryptoPaymentData(res);
        toast.success("Crypto payment initiated. Send to the address shown.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to initiate payment");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="text-center text-white/80">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          Loading payment details…
        </div>
      </div>
    );
  }

  if (!paymentLink) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Link Not Found</h1>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  if (cryptoPaymentData) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Crypto Payment</CardTitle>
          </CardHeader>
          <CardContent className="text-center p-8">
            <Bitcoin className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Send Payment</h1>
            <p className="text-white/70 mb-6">
              Send exactly{" "}
              <strong>
                {cryptoPaymentData.pay_amount} {cryptoPaymentData.pay_currency}
              </strong>{" "}
              to:
            </p>
            <div className="bg-white/5 p-4 rounded-lg mb-6">
              <p className="text-xs text-white/70 mb-2">Wallet Address</p>
              <p className="font-mono text-sm break-all bg-black/40 p-2 rounded border border-white/10">
                {cryptoPaymentData.pay_address}
              </p>
            </div>
            <Button onClick={() => navigate("/")}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentCompleted) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-white/70 mb-6">
              {paymentLink.successMessage || "Thank you for your payment"}
            </p>
            <Button onClick={() => navigate("/")}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 lg:px-12 py-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> {paymentLink.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Poster / cover without image placeholder */}
              {paymentLink.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={paymentLink.imageUrl}
                  alt={paymentLink.title}
                  className="w-full h-48 object-cover rounded"
                />
              ) : (
                <div className="w-full h-48 rounded bg-gradient-to-br from-neutral-800 to-neutral-900 ring-1 ring-white/10" />
              )}
              <p className="text-white/80">{paymentLink.description}</p>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded">
                <span className="text-lg font-semibold">Amount</span>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {paymentLink.currency} {paymentLink.price}
                  </div>
                </div>
              </div>
              {paymentLink.creator ? (
                <div className="border-t border-white/10 pt-4">
                  <h3 className="font-medium mb-2">Created by</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full grid place-items-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {paymentLink.creator.name}
                      </div>
                      <div className="text-sm text-white/70">
                        {paymentLink.creator.bio}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Rent This Movie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/80">
                    Full Name
                  </label>
                  <input
                    className="mt-1 w-full rounded bg-white/5 px-3 py-2 ring-1 ring-white/10"
                    value={customerData.name}
                    onChange={(e) =>
                      setCustomerData((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/80">Email</label>
                  <input
                    type="email"
                    className="mt-1 w-full rounded bg-white/5 px-3 py-2 ring-1 ring-white/10"
                    value={customerData.email}
                    onChange={(e) =>
                      setCustomerData((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/80">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("fiat")}
                    className={`p-4 border rounded text-center transition-colors ${paymentMethod === "fiat" ? "border-primary bg-primary/10 text-primary" : "border-white/10 hover:border-white/20"}`}
                  >
                    <Globe className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm font-medium">Card/Bank</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("crypto")}
                    className={`p-4 border rounded text-center transition-colors ${paymentMethod === "crypto" ? "border-primary bg-primary/10 text-primary" : "border-white/10 hover:border-white/20"}`}
                  >
                    <Bitcoin className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm font-medium">Crypto</span>
                  </button>
                </div>
              </div>

              {paymentMethod === "fiat" ? (
                <div>
                  <label className="block text-sm text-white/80">
                    Currency
                  </label>
                  <select
                    className="mt-1 w-full rounded bg-white/5 px-3 py-2 ring-1 ring-white/10"
                    value={customerData.currency}
                    onChange={(e) =>
                      setCustomerData((p) => ({
                        ...p,
                        currency: e.target.value,
                      }))
                    }
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="NGN">NGN</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-white/80">
                    Cryptocurrency
                  </label>
                  <select
                    className="mt-1 w-full rounded bg-white/5 px-3 py-2 ring-1 ring-white/10"
                    value={cryptoCurrency}
                    onChange={(e) => setCryptoCurrency(e.target.value)}
                  >
                    <option value="BTC">BTC - Bitcoin</option>
                    <option value="ETH">ETH - Ethereum</option>
                    <option value="USDT">USDT - Tether</option>
                    <option value="BNB">BNB - Binance Coin</option>
                  </select>
                </div>
              )}

              <Button
                onClick={handlePayment}
                disabled={
                  isProcessing || !customerData.name || !customerData.email
                }
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" /> Processing…
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4 mr-2" /> Rent for{" "}
                    {paymentMethod === "fiat"
                      ? customerData.currency
                      : cryptoCurrency}{" "}
                    {paymentMethod === "fiat"
                      ? paymentLink.price
                      : "Equivalent"}
                  </>
                )}
              </Button>
              <p className="text-xs text-white/60 text-center">
                Secure payment powered by trusted providers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
