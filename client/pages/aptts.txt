const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
import { supabase } from './supabaseClient';
import type { Creator, PaymentLink, LandingPage, DashboardStats } from '../types';

export const API_URL = API_BASE_URL;

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Get the current session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: { email: string; password: string; name: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Creators
  async createCreator(creatorData: Partial<Creator>): Promise<{ success: boolean; message: string; creator: Creator }> {
    return this.request('/creators', {
      method: 'POST',
      body: JSON.stringify(creatorData),
    });
  }

  async getCurrentCreator(): Promise<{ success: boolean; creator: Creator }> {
    return this.request('/creators/me');
  }

  async getCreator(creatorId: string): Promise<Creator> {
    return this.request(`/creators/${creatorId}`);
  }

  async updateCreator(creatorId: string, updates: Partial<Creator>): Promise<{ success: boolean; creator: Creator }> {
    return this.request(`/creators/${creatorId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Payment Links
  async createPaymentLink(paymentLinkData: Partial<PaymentLink>): Promise<{ success: boolean; paymentLink: PaymentLink }> {
    return this.request('/payment-links', {
      method: 'POST',
      body: JSON.stringify(paymentLinkData),
    });
  }

  async getPaymentLinks(creatorId: string, filters?: { published?: boolean; type?: string }): Promise<{ success: boolean; paymentLinks: PaymentLink[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.published !== undefined) params.set('published', filters.published.toString());
    if (filters?.type) params.set('type', filters.type);

    return this.request(`/creators/${creatorId}/payment-links?${params}`);
  }

  async updatePaymentLink(paymentLinkId: string, updates: Partial<PaymentLink>) {
    return this.request(`/payment-links/${paymentLinkId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async publishPaymentLink(paymentLinkId: string, isPublished: boolean) {
    return this.request(`/payment-links/${paymentLinkId}/publish`, {
      method: 'POST',
      body: JSON.stringify({ isPublished }),
    });
  }

  // Landing Pages
  async createLandingPage(pageData: Partial<LandingPage>): Promise<{ success: boolean; landingPage: LandingPage }> {
    return this.request('/landing-pages', {
      method: 'POST',
      body: JSON.stringify(pageData),
    });
  }

  async getLandingPages(creatorId: string, filters?: { published?: boolean; type?: string }) {
    const params = new URLSearchParams();
    if (filters?.published !== undefined) params.set('published', filters.published.toString());
    if (filters?.type) params.set('type', filters.type);

    return this.request(`/landing-pages/creator/${creatorId}?${params}`);
  }

  async getLandingPage(landingPageId: string): Promise<{ success: boolean; landingPage: LandingPage }> {
    return this.request(`/landing-pages/${landingPageId}`);
  }

  async updateLandingPage(landingPageId: string, updates: Partial<LandingPage>) {
    return this.request(`/landing-pages/${landingPageId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async publishLandingPage(landingPageId: string, isPublished: boolean) {
    return this.request(`/landing-pages/${landingPageId}/publish`, {
      method: 'POST',
      body: JSON.stringify({ isPublished }),
    });
  }

  async deleteLandingPage(landingPageId: string) {
    return this.request(`/landing-pages/${landingPageId}`, {
      method: 'DELETE',
    });
  }

  // Public Pages
  async getPublicPage(slug: string) {
    return this.request(`/pages/${slug}`);
  }

  // Landing Page by Slug (Public)
  async getLandingPageBySlug(slug: string) {
    return this.request(`/landing-pages/slug/${slug}`);
  }

  // Payment Link Details (Public)
  async getPaymentLinkDetails(slug: string): Promise<{ success: boolean; paymentLink: any }> {
    return this.request(`/payments/link/${slug}`);
  }

  // Dashboard
  async getDashboardStats(creatorId: string): Promise<{ success: boolean; summary: DashboardStats }> {
    return this.request(`/dashboard/creator/${creatorId}/summary`);
  }

  async getLatestTransactions(creatorId: string, limit: number = 10): Promise<{ success: boolean; transactions: any[] }> {
    return this.request(`/dashboard/creator/${creatorId}/latest-transactions?limit=${limit}`);
  }

  async getQuickLinks(creatorId: string): Promise<{ success: boolean; quickLinks: any[] }> {
    return this.request(`/dashboard/creator/${creatorId}/quick-links`);
  }

  // Payment Methods
  async getPaymentMethods(amount: number, currency: string) {
    return this.request(`/payment-methods/compare?amount=${amount}&currency=${currency}`);
  }

  async getSupportedCurrencies() {
    return this.request('/payment-methods/currencies');
  }

  // Payment initiation
  async initiatePayment(paymentData: {
    paymentLinkId: string;
    customerEmail: string;
    customerName: string;
    customerCurrency?: string;
    redirectUrl?: string;
  }): Promise<{ success: boolean; payment_url?: string; reference?: string; transaction_id?: string; paymentLink?: any }> {
    return this.request('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Crypto payment creation
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
    return this.request('/crypto/create-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Crypto payment status
  async getCryptoPaymentStatus(paymentId: string): Promise<{ success: boolean; status: string; payment: any }> {
    return this.request(`/crypto/payment-status/${paymentId}`);
  }

  // Image upload
  async uploadImage(formData: FormData): Promise<{ success: boolean; imageUrl: string; imageId: string; fileName: string; fileSize: number; mimeType: string }> {
    // Get the current session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    };

    const response = await fetch(`${API_BASE_URL}/images/upload`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Transform the response to match the expected interface
    return {
      success: result.success,
      imageUrl: result.image?.url || result.imageUrl,
      imageId: result.image?.id || result.imageId,
      fileName: result.image?.fileName || result.fileName,
      fileSize: result.image?.fileSize || result.fileSize,
      mimeType: result.image?.mimeType || result.mimeType,
    };
  }

  async uploadProfilePicture(formData: FormData): Promise<{ success: boolean; imageUrl: string; message: string }> {
    // Get the current session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    };

    const response = await fetch(`${API_BASE_URL}/images/upload/profile-picture`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // AI Landing Page Generation
  async generateLandingPage(data: {
    prompt: string;
    images?: string[];
    pageType?: string;
    targetAudience?: string;
    tone?: string;
  }): Promise<{ success: boolean; message: string; landingPage: LandingPage; generatedPaymentLinks: any[] }> {
    return this.request('/ai/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getGenerationTemplates(): Promise<{ success: boolean; templates: any[] }> {
    return this.request('/ai/landing-pages/templates');
  }

  // Video Management
  async uploadVideo(formData: FormData): Promise<{ success: boolean; videoUrl: string; coverImageUrl?: string; videoId: string; fileName: string; fileSize: number; mimeType: string }> {
    // Get the current session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    };

    const response = await fetch(`${API_BASE_URL}/videos/upload`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getVideo(videoId: string): Promise<{ success: boolean; video: any }> {
    return this.request(`/videos/${videoId}`);
  }

  async getUserVideos(userId: string, filters?: { isPublic?: boolean; limit?: number; offset?: number }): Promise<{ success: boolean; videos: any[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.isPublic !== undefined) params.set('isPublic', filters.isPublic.toString());
    if (filters?.limit) params.set('limit', filters.limit.toString());
    if (filters?.offset) params.set('offset', filters.offset.toString());

    return this.request(`/videos/user/${userId}?${params}`);
  }

  async getPublicVideos(filters?: { limit?: number; offset?: number }): Promise<{ success: boolean; videos: any[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.limit) params.set('limit', filters.limit.toString());
    if (filters?.offset) params.set('offset', filters.offset.toString());

    return this.request(`/videos/public?${params}`);
  }

  async deleteVideo(videoId: string): Promise<{ success: boolean }> {
    return this.request(`/videos/${videoId}`, {
      method: 'DELETE',
    });
  }

}

export const api = new ApiClient();
export * from '../types';