import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { api } from '../lib/api';
import {
  CreditCard,
  DollarSign,
  User,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader,
  Bitcoin,
  Globe,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentLink {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
  successMessage: string;
  creator: {
    name: string;
    bio: string;
    socialLinks: string[];
    jaraPageSlug: string;
  };
}

export function PaymentPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    currency: 'USD',
  });

  const [paymentMethod, setPaymentMethod] = useState<'fiat' | 'crypto'>('fiat');
  const [cryptoCurrency, setCryptoCurrency] = useState('BTC');
  const [cryptoPaymentData, setCryptoPaymentData] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      loadPaymentLink();
    }
  }, [slug]);

  // Poll crypto payment status
  useEffect(() => {
    if (cryptoPaymentData?.payment_id) {
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await api.getCryptoPaymentStatus(cryptoPaymentData.payment_id);
          if (statusResponse.status === 'finished' || statusResponse.status === 'confirmed') {
            clearInterval(pollInterval);
            navigate('/payment-success', {
              state: { message: paymentLink?.successMessage || 'Your crypto payment has been confirmed!' }
            });
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }, 10000); // Check every 10 seconds

      return () => clearInterval(pollInterval);
    }
  }, [cryptoPaymentData, paymentLink, navigate]);

  const loadPaymentLink = async () => {
    try {
      setIsLoading(true);
      const response = await api.getPaymentLinkDetails(slug!);
      setPaymentLink(response.paymentLink);
    } catch (error) {
      console.error('Error loading payment link:', error);
      toast.error('Payment link not found or not available');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentLink) return;

    try {
      setIsProcessing(true);

      if (paymentMethod === 'fiat') {
        // Initiate fiat payment with Flutterwave
        const response = await api.initiatePayment({
          paymentLinkId: paymentLink.id,
          customerEmail: customerData.email,
          customerName: customerData.name,
          customerCurrency: customerData.currency,
          redirectUrl: `${window.location.origin}/payment-success`,
        });

        // Redirect to Flutterwave payment URL
        if (response.payment_url) {
          window.location.href = response.payment_url;
        } else {
          throw new Error('Payment URL not provided');
        }
      } else {
        // Initiate crypto payment
        const response = await api.createCryptoPayment({
          paymentLinkId: paymentLink.id,
          customerEmail: customerData.email,
          customerName: customerData.name,
          payCurrency: cryptoCurrency,
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: window.location.href,
          orderId: `payment_${Date.now()}`,
          orderDescription: `Payment for ${paymentLink.title}`,
        });

        // For crypto, show wallet address instead of redirecting
        setCryptoPaymentData(response);
        toast.success('Crypto payment initiated! Please send payment to the displayed address.');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!paymentLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Link Not Found</h1>
          <p className="text-gray-600 mb-6">The payment link you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  if (cryptoPaymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Crypto Payment</CardTitle>
          </CardHeader>
          <CardContent className="text-center p-8">
            <Bitcoin className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Send Payment</h1>
            <p className="text-gray-600 mb-6">
              Please send exactly <strong>{cryptoPaymentData.pay_amount} {cryptoPaymentData.pay_currency}</strong> to the address below.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-2">Wallet Address:</p>
              <p className="font-mono text-sm break-all bg-white p-2 rounded border">
                {cryptoPaymentData.pay_address}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                After sending the payment, it will be confirmed automatically.
              </p>
              <Button onClick={() => navigate('/')}>Return Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">{paymentLink.successMessage}</p>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Thank you for your payment</p>
              <Button onClick={() => navigate('/')}>Return Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Link Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>{paymentLink.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentLink.imageUrl && (
                  <img
                    src={paymentLink.imageUrl}
                    alt={paymentLink.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}

                <div>
                  <p className="text-gray-600 mb-4">{paymentLink.description}</p>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-lg font-semibold">Amount:</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {paymentLink.currency} {paymentLink.price}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Created by</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{paymentLink.creator.name}</p>
                      <p className="text-sm text-gray-600">{paymentLink.creator.bio}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Rent This Movie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={customerData.name}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerData.email}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div>
                  <Label className="text-base font-medium">Payment Method</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('fiat')}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        paymentMethod === 'fiat'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Globe className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Card/Bank</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('crypto')}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        paymentMethod === 'crypto'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Bitcoin className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Cryptocurrency</span>
                    </button>
                  </div>
                </div>

                {/* Currency Selection for Fiat */}
                {paymentMethod === 'fiat' && (
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      value={customerData.currency}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="NGN">NGN - Nigerian Naira</option>
                    </select>
                  </div>
                )}

                {/* Crypto Currency Selection */}
                {paymentMethod === 'crypto' && (
                  <div>
                    <Label htmlFor="cryptoCurrency">Cryptocurrency</Label>
                    <select
                      id="cryptoCurrency"
                      value={cryptoCurrency}
                      onChange={(e) => setCryptoCurrency(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
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
                  disabled={isProcessing || !customerData.name || !customerData.email}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4 mr-2" />
                      Rent for {paymentMethod === 'fiat' ? customerData.currency : cryptoCurrency} {paymentMethod === 'fiat' ? paymentLink.price : 'Equivalent'}
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Your payment is secured and processed by trusted payment providers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}