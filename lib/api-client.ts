/**
 * Client kết nối Frontend Next.js tới Backend NestJS Hexagonal API
 * Hỗ trợ tự động gắn JWT Bearer Token, kiểm tra trạng thái và xử lý lỗi chuẩn mực
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  data: T;
  message?: string;
  timestamp: string;
}

class ApiClient {
  private token: string | null = null;
  private refreshTokenVal: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('nova_auth_token');
      this.refreshTokenVal = localStorage.getItem('nova_refresh_token');
    }
  }

  setSession(accessToken: string, refreshToken?: string, user?: any) {
    this.token = accessToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('nova_auth_token', accessToken);
      // Ghi cookie để Next.js Edge Proxy đọc được quyền truy cập tức thì
      document.cookie = `nova_auth_token=${accessToken}; path=/; max-age=604800; SameSite=Lax`;
      
      if (refreshToken) {
        this.refreshTokenVal = refreshToken;
        localStorage.setItem('nova_refresh_token', refreshToken);
      }
      if (user) {
        localStorage.setItem('nova_auth_user', JSON.stringify(user));
        document.cookie = `nova_auth_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `nova_auth_user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=604800; SameSite=Lax`;
      }
    }
  }

  setToken(token: string) {
    this.setSession(token);
  }

  clearToken() {
    this.token = null;
    this.refreshTokenVal = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nova_auth_token');
      localStorage.removeItem('nova_refresh_token');
      localStorage.removeItem('nova_auth_user');
      document.cookie = 'nova_auth_token=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'nova_auth_role=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'nova_auth_user=; path=/; max-age=0; SameSite=Lax';
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      const fromStorage = localStorage.getItem('nova_auth_token');
      if (fromStorage) {
        this.token = fromStorage;
        return this.token;
      }
      const match = document.cookie.match(/nova_auth_token=([^;]+)/);
      if (match && match[1]) {
        this.token = decodeURIComponent(match[1]);
        return this.token;
      }
    }
    return null;
  }

  getUser(): any {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('nova_auth_user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {}
      }

      // Đọc từ cookie nova_auth_user nếu localStorage chưa kịp gán (ví dụ qua test context)
      const match = document.cookie.match(/nova_auth_user=([^;]+)/);
      if (match && match[1]) {
        try {
          return JSON.parse(decodeURIComponent(match[1]));
        } catch {}
      }
    }
    return null;
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(url, {
        ...options,
        headers,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || `Lỗi yêu cầu máy chủ: ${res.status}`);
      }

      return json.data !== undefined ? json.data : json;
    } catch (err: any) {
      console.warn(`[API Client Warning] Không thể kết nối ${url}: ${err.message}`);
      throw err;
    }
  }

  // 1. Phân Hệ Xác Thực & Phân Quyền (Auth & RBAC)
  readonly auth = {
    login: async (email: string, password: string) => {
      const data = await this.request<{ accessToken: string; refreshToken: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data?.accessToken) {
        this.setSession(data.accessToken, data.refreshToken, data.user);
      }
      return data;
    },
    register: (userData: any) =>
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    refreshToken: async () => {
      if (!this.refreshTokenVal) throw new Error('Không có refresh token');
      const data = await this.request<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: this.refreshTokenVal }),
      });
      if (data?.accessToken) {
        this.setSession(data.accessToken, data.refreshToken);
      }
      return data;
    },
    getProfile: () => this.request('/auth/profile'),
    changePassword: (dto: { oldPassword: string; newPassword: string }) =>
      this.request('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(dto),
      }),
    logout: () => {
      this.clearToken();
    },
  };

  // 2. Đại Dự Án (Projects)
  readonly projects = {
    getAll: () => this.request<any[]>('/projects'),
    getById: (id: string) => this.request<any>(`/projects/${id}`),
  };

  // 3. Rổ Hàng & Sơ Đồ Phân Lô (Inventory)
  readonly inventory = {
    getAll: (params?: { projectId?: string; status?: string; minPrice?: number; maxPrice?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.projectId) searchParams.append('projectId', params.projectId);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.minPrice) searchParams.append('minPrice', params.minPrice.toString());
      if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
      return this.request<any[]>(`/inventory?${searchParams.toString()}`);
    },
    getStats: (projectId?: string) =>
      this.request<any>(`/inventory/stats${projectId ? `?projectId=${projectId}` : ''}`),
    batchLock: (unitIds: string[], status: 'LOCKED' | 'AVAILABLE') =>
      this.request('/inventory/batch-lock', {
        method: 'POST',
        body: JSON.stringify({ unitIds, targetStatus: status }),
      }),
  };

  // 4. Booking & Khóa Căn 15 Phút (Bookings)
  readonly bookings = {
    getAll: (projectId?: string, stage?: string) => {
      const searchParams = new URLSearchParams();
      if (projectId) searchParams.append('projectId', projectId);
      if (stage) searchParams.append('stage', stage);
      return this.request<any[]>(`/bookings?${searchParams.toString()}`);
    },
    getById: (id: string) => this.request<any>(`/bookings/${id}`),
    create: (data: {
      unitId: string;
      customerId: string;
      projectId: string;
      depositAmount: number;
      bookingType: string;
      priority?: string;
      notes?: string;
      paymentProofUrl?: string;
    }) =>
      this.request('/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    approve: (id: string, comment?: string) =>
      this.request(`/bookings/${id}/approve`, {
        method: 'PATCH',
        body: JSON.stringify({ comment }),
      }),
    reject: (id: string, reason: string) =>
      this.request(`/bookings/${id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      }),
    extendSla: (id: string, minutes: number, reason: string) =>
      this.request(`/bookings/${id}/extend-sla`, {
        method: 'PATCH',
        body: JSON.stringify({ minutes, reason }),
      }),
  };

  // 5. Khách Hàng 360 (Customers)
  readonly customers = {
    getAll: (rank?: string, search?: string) => {
      const searchParams = new URLSearchParams();
      if (rank) searchParams.append('rank', rank);
      if (search) searchParams.append('search', search);
      return this.request<any[]>(`/customers?${searchParams.toString()}`);
    },
    getById: (id: string) => this.request<any>(`/customers/${id}`),
  };

  // 6. Hợp Đồng & Ký Số e-Sign (Contracts)
  readonly contracts = {
    getAll: (status?: string) =>
      this.request<any[]>(`/contracts${status ? `?status=${status}` : ''}`),
    getById: (id: string) => this.request<any>(`/contracts/${id}`),
    create: (data: {
      type: string;
      customerId: string;
      unitId: string;
      projectId: string;
      value: number;
    }) =>
      this.request('/contracts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    eSign: (id: string, signerName: string) =>
      this.request(`/contracts/${id}/esign`, {
        method: 'POST',
        body: JSON.stringify({ signerName }),
      }),
    recordPayment: (id: string, amount: number) =>
      this.request(`/contracts/${id}/payments`, {
        method: 'POST',
        body: JSON.stringify({ amount }),
      }),
  };

  // 7. Phòng Đấu Giá Live (Auctions)
  readonly auctions = {
    getAll: () => this.request<any[]>('/auctions'),
    getById: (id: string) => this.request<any>(`/auctions/${id}`),
  };

  // 8. Đối Soát Gạch Nợ VietQR IPN (Payments)
  readonly payments = {
    getTransactions: (limit: number = 50) =>
      this.request<any[]>(`/payments/transactions?limit=${limit}`),
    simulateVietQrIpn: (data: {
      transactionId: string;
      amount: number;
      content: string;
      bankCode?: string;
      accountNumber?: string;
    }) =>
      this.request('/payments/vietqr-ipn', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };

  // 9. Bàn Giao & Nghiệm Thu (Handover)
  readonly handover = {
    getTickets: (status?: string) =>
      this.request<any[]>(`/handover/tickets${status ? `?status=${status}` : ''}`),
    getTicketById: (id: string) => this.request<any>(`/handover/tickets/${id}`),
    createTicket: (data: any) =>
      this.request('/handover/tickets', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      this.request(`/handover/tickets/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    sign: (id: string, signedByCustomer: boolean, signedByStaff: boolean) =>
      this.request(`/handover/tickets/${id}/sign`, { method: 'POST', body: JSON.stringify({ signedByCustomer, signedByStaff }) }),
  };

  // 10. Vận Hành Tòa Nhà Cư Dân (Operations)
  readonly operations = {
    getBills: (month?: string, status?: string) => {
      const q = new URLSearchParams();
      if (month) q.append('month', month);
      if (status) q.append('status', status);
      return this.request<any[]>(`/operations/bills?${q.toString()}`);
    },
    payBill: (id: string, method?: string) =>
      this.request(`/operations/bills/${id}/pay`, { method: 'PATCH', body: JSON.stringify({ method: method || 'VNPAY' }) }),
    getFitoutPermits: () => this.request<any[]>('/operations/fitout-permits'),
    bookAmenity: (data: any) =>
      this.request('/operations/amenity-bookings', { method: 'POST', body: JSON.stringify(data) }),
  };

  // 11. Ký Gửi Thứ Cấp & Co-brokering (Resale)
  readonly resale = {
    getListings: (type?: string, project?: string) => {
      const q = new URLSearchParams();
      if (type) q.append('type', type);
      if (project) q.append('project', project);
      return this.request<any[]>(`/resale/listings?${q.toString()}`);
    },
    createListing: (data: any) =>
      this.request('/resale/listings', { method: 'POST', body: JSON.stringify(data) }),
    getDemands: () => this.request<any[]>('/resale/demands'),
    matchDemand: (demandId: string) =>
      this.request<any[]>(`/resale/demands/${demandId}/match`),
  };

  // 12. Quản Trị Gia Sản VIP (Portfolio)
  readonly portfolio = {
    getAssets: (customerId?: string) =>
      this.request<any[]>(`/portfolio/assets${customerId ? `?customerId=${customerId}` : ''}`),
    getAssetById: (id: string) => this.request<any>(`/portfolio/assets/${id}`),
    createAsset: (data: any) =>
      this.request('/portfolio/assets', { method: 'POST', body: JSON.stringify(data) }),
    updateValuation: (id: string, valuation: number) =>
      this.request(`/portfolio/assets/${id}/valuation`, { method: 'PATCH', body: JSON.stringify({ valuation }) }),
    getSummary: (customerId?: string) =>
      this.request<any>(`/portfolio/summary${customerId ? `?customerId=${customerId}` : ''}`),
  };

  // 13. Chiến Dịch Tiếp Thị Đa Kênh (Marketing)
  readonly marketing = {
    getCampaigns: (status?: string, platform?: string) => {
      const q = new URLSearchParams();
      if (status) q.append('status', status);
      if (platform) q.append('platform', platform);
      return this.request<any[]>(`/marketing/campaigns?${q.toString()}`);
    },
    getCampaignById: (id: string) => this.request<any>(`/marketing/campaigns/${id}`),
    createCampaign: (data: any) =>
      this.request('/marketing/campaigns', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      this.request(`/marketing/campaigns/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    ingestLead: (id: string, count: number = 1) =>
      this.request(`/marketing/campaigns/${id}/ingest-lead`, { method: 'POST', body: JSON.stringify({ count }) }),
    getMetrics: () => this.request<any>('/marketing/metrics'),
  };

  // 14. Khách Hàng Thân Thiết NovaClub (Loyalty)
  readonly loyalty = {
    getVouchers: (category?: string) =>
      this.request<any[]>(`/loyalty/vouchers${category ? `?category=${category}` : ''}`),
    createVoucher: (data: any) =>
      this.request('/loyalty/vouchers', { method: 'POST', body: JSON.stringify(data) }),
    redeemVoucher: (voucherId: string, customerId: string) =>
      this.request('/loyalty/redeem', { method: 'POST', body: JSON.stringify({ voucherId, customerId }) }),
    getTransactions: (customerId?: string) =>
      this.request<any[]>(`/loyalty/transactions${customerId ? `?customerId=${customerId}` : ''}`),
    awardPoints: (data: { customerId: string; points: number; description: string; referenceCode?: string }) =>
      this.request('/loyalty/award-points', { method: 'POST', body: JSON.stringify(data) }),
    getMemberProfile: (customerId: string) =>
      this.request<any>(`/loyalty/members/${customerId}`),
  };

  // 15. Đua Top & Nhiệm Vụ Chiến Binh (Gamification)
  readonly gamification = {
    getQuests: () => this.request<any[]>('/gamification/quests'),
    claimQuest: (questId: number, userId?: string) =>
      this.request(`/gamification/quests/${questId}/claim`, { method: 'POST', body: JSON.stringify({ userId }) }),
    getBadges: () => this.request<any[]>('/gamification/badges'),
    getRewards: () => this.request<any[]>('/gamification/rewards'),
    redeemReward: (rewardId: string, userId?: string) =>
      this.request(`/gamification/rewards/${rewardId}/redeem`, { method: 'POST', body: JSON.stringify({ userId }) }),
    getLeaderboard: (period?: 'week' | 'month' | 'quarter') =>
      this.request<any[]>(`/gamification/leaderboard${period ? `?period=${period}` : ''}`),
  };

  // 16. Sàn Liên Kết Đại Lý F1/F2 (Marketplace)
  readonly marketplace = {
    getListings: (category?: string, type?: string, verifiedOnly?: boolean) => {
      const q = new URLSearchParams();
      if (category) q.append('category', category);
      if (type) q.append('type', type);
      if (verifiedOnly) q.append('verifiedOnly', 'true');
      return this.request<any[]>(`/marketplace/listings?${q.toString()}`);
    },
    getListingById: (id: string) => this.request<any>(`/marketplace/listings/${id}`),
    createListing: (data: any) =>
      this.request('/marketplace/listings', { method: 'POST', body: JSON.stringify(data) }),
    getPartners: () => this.request<any[]>('/marketplace/partners'),
    registerPartner: (data: any) =>
      this.request('/marketplace/partners', { method: 'POST', body: JSON.stringify(data) }),
    requestCoBrokering: (id: string, partnerName: string, clientName: string) =>
      this.request(`/marketplace/listings/${id}/co-broker`, { method: 'POST', body: JSON.stringify({ partnerName, clientName }) }),
  };

  // 17. Khảo Sát NPS/CSAT (Surveys)
  readonly surveys = {
    getCampaigns: () => this.request<any[]>('/surveys/campaigns'),
    createCampaign: (data: any) =>
      this.request('/surveys/campaigns', { method: 'POST', body: JSON.stringify(data) }),
    submitFeedback: (data: any) =>
      this.request('/surveys/feedback', { method: 'POST', body: JSON.stringify(data) }),
    getFeedbacks: (category?: string, sentiment?: string) => {
      const q = new URLSearchParams();
      if (category) q.append('category', category);
      if (sentiment) q.append('sentiment', sentiment);
      return this.request<any[]>(`/surveys/feedback?${q.toString()}`);
    },
    getMetrics: () => this.request<any>('/surveys/metrics'),
  };

  // 18. Tài Chính Tín Dụng Ngân Hàng (Mortgage)
  readonly mortgage = {
    calculate: (data: any) =>
      this.request<any>('/mortgage/calculate', { method: 'POST', body: JSON.stringify(data) }),
    saveSimulation: (data: any) =>
      this.request('/mortgage/save', { method: 'POST', body: JSON.stringify(data) }),
    getSimulations: (customerId?: string) =>
      this.request<any[]>(`/mortgage/simulations${customerId ? `?customerId=${customerId}` : ''}`),
    getBankPackages: () => this.request<any[]>('/mortgage/bank-packages'),
  };

  // 19. Phân Tích Kinh Doanh BI (BI & Analytics)
  readonly bi = {
    getMacroMetrics: () => this.request<any>('/bi/macro-metrics'),
    getArimaForecast: (months?: number) =>
      this.request<any[]>(`/bi/arima-forecast${months ? `?months=${months}` : ''}`),
    getTelesaleHeatmap: () => this.request<any[]>('/bi/telesale-heatmap'),
    getConversionFunnel: (projectId?: string) =>
      this.request<any[]>(`/bi/conversion-funnel${projectId ? `?projectId=${projectId}` : ''}`),
  };

  // 20. Tích Hợp API, Webhook ERP & SmartCA (Integrations)
  readonly integrations = {
    getApps: (category?: string) =>
      this.request<any[]>(`/integrations/apps${category ? `?category=${category}` : ''}`),
    toggleApp: (appCode: string, connected: boolean) =>
      this.request(`/integrations/apps/${appCode}/toggle`, { method: 'PATCH', body: JSON.stringify({ connected }) }),
    getWebhooks: () => this.request<any[]>('/integrations/webhooks'),
    createWebhook: (data: any) =>
      this.request('/integrations/webhooks', { method: 'POST', body: JSON.stringify(data) }),
    testWebhook: (id: string) =>
      this.request(`/integrations/webhooks/${id}/test`, { method: 'POST' }),
    getApiKeys: () => this.request<any[]>('/integrations/api-keys'),
    createApiKey: (data: any) =>
      this.request('/integrations/api-keys', { method: 'POST', body: JSON.stringify(data) }),
    revokeApiKey: (id: string) =>
      this.request(`/integrations/api-keys/${id}/revoke`, { method: 'PATCH' }),
    getAuditLogs: () => this.request<any[]>('/integrations/audit-logs'),
    verifySmartCA: (data: { contractCode: string; documentHash: string; certificateSerial?: string }) =>
      this.request('/integrations/smartca/verify', { method: 'POST', body: JSON.stringify(data) }),
  };
}

export const apiClient = new ApiClient();

