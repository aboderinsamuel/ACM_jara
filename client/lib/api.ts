// API client adapted from aptts.txt, wired to our shared env and supabase
import { API_URL as BASE } from "@shared/env";
import { supabase } from "@shared/supabase";

export const API_BASE_URL = BASE || "http://localhost:3001/api";

// ---- Minimal types used by pages ----
export type Creator = {
  id: string;
  name?: string;
  bio?: string;
  socialLinks?: string[];
  jaraPageSlug?: string;
};

export type PaymentLinkType =
  | "tip"
  | "membership"
  | "pay_per_view"
  | "rental"
  | "ticket"
  | "product";

export type PaymentLink = {
  id: string;
  slug: string;
  type: PaymentLinkType;
  title: string;
  description?: string;
  price: number;
  currency: string;
  image_url?: string;
  imageUrl?: string; // some APIs use camelCase
  isPublished: boolean;
  totalRevenue?: number;
  totalTransactions?: number;
  creatorId?: string;
};

export type LandingPage = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  isPublished: boolean;
};

export type DashboardStats = {
  totalRevenue: number;
  totalTransactions: number;
  totalCustomers: number;
  conversionRate?: number;
};

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Prefer Supabase session token; fall back to our local auth token
    let token: string | undefined;
    try {
      const { data } = await supabase.auth.getSession();
      token = data?.session?.access_token;
    } catch {}
    if (!token) {
      try {
        token = localStorage.getItem("auth_token") || undefined;
      } catch {}
    }

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, config);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Public: Landing Page by Slug
  async getLandingPageBySlug(slug: string): Promise<{ success: boolean; landingPage: any }>
  {
    return this.request(`/landing-pages/slug/${slug}`);
  }

  // Creators
  async getCurrentCreator(): Promise<{ success: boolean; creator: Creator }> {
    return this.request(`/creators/me`);
  }

  async getCreator(creatorId: string): Promise<Creator> {
    return this.request(`/creators/${creatorId}`);
  }

  // Payment Links
  async createPaymentLink(paymentLinkData: Partial<PaymentLink>): Promise<{ success: boolean; paymentLink: PaymentLink }> {
    return this.request(`/payment-links`, { method: "POST", body: JSON.stringify(paymentLinkData) });
  }

  async getPaymentLinks(
    creatorId: string,
    filters?: { published?: boolean; type?: string },
  ): Promise<{ success: boolean; paymentLinks: PaymentLink[]; total?: number }> {
    const params = new URLSearchParams();
    if (filters?.published !== undefined) params.set("published", String(filters.published));
    if (filters?.type) params.set("type", filters.type);
    return this.request(`/creators/${creatorId}/payment-links?${params.toString()}`);
  }

  async updatePaymentLink(paymentLinkId: string, updates: Partial<PaymentLink>) {
    return this.request(`/payment-links/${paymentLinkId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async publishPaymentLink(paymentLinkId: string, isPublished: boolean) {
    return this.request(`/payment-links/${paymentLinkId}/publish`, {
      method: "POST",
      body: JSON.stringify({ isPublished }),
    });
  }

  // Public payment link details
  async getPaymentLinkDetails(slug: string): Promise<{ success: boolean; paymentLink: any }> {
    return this.request(`/payments/link/${slug}`);
  }

  // Payment initiation
  async initiatePayment(paymentData: {
    paymentLinkId: string;
    customerEmail: string;
    customerName: string;
    customerCurrency?: string;
    redirectUrl?: string;
  }): Promise<{ success: boolean; payment_url?: string; reference?: string; transaction_id?: string; paymentLink?: any }> {
    return this.request(`/payments/initiate`, { method: "POST", body: JSON.stringify(paymentData) });
  }

  // Crypto
  async createCryptoPayment(paymentData: {
    paymentLinkId: string;
    customerEmail: string;
    customerName: string;
    payCurrency: string;
    ipnCallbackUrl?: string;
    successUrl?: string;
    cancelUrl?: string;
    orderId?: string;
    orderDescription?: string;
  }): Promise<{ success: boolean; payment_url: string; payment_id: string; pay_address: string; pay_amount: number; pay_currency: string; order_id: string; reference: string; paymentLink: any }> {
    return this.request(`/crypto/create-payment`, { method: "POST", body: JSON.stringify(paymentData) });
  }

  async getCryptoPaymentStatus(paymentId: string): Promise<{ success: boolean; status: string; payment: any }> {
    return this.request(`/crypto/payment-status/${paymentId}`);
  }
}

export const api = new ApiClient();
export type { PaymentLink as IPaymentLink };
