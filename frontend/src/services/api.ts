const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const api = {
  // Policies
  async getPolicies(params: { category?: string; ward_number?: number; status?: string; search?: string; lang?: string } = {}) {
    const query = new URLSearchParams();
    if (params.category) query.append("category", params.category);
    if (params.ward_number) query.append("ward_number", params.ward_number.toString());
    if (params.status) query.append("status", params.status);
    if (params.search) query.append("search", params.search);
    if (params.lang) query.append("lang", params.lang);

    const res = await fetch(`${API_BASE}/policies?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch policies");
    return res.json();
  },

  async getPolicyDetail(id: number, lang: string = "en") {
    const res = await fetch(`${API_BASE}/policies/${id}?lang=${lang}`);
    if (!res.ok) throw new Error("Failed to fetch policy details");
    return res.json();
  },

  async getPolicyReport(id: number, lang: string = "en") {
    const res = await fetch(`${API_BASE}/policies/${id}/report?lang=${lang}`);
    if (!res.ok) throw new Error("Failed to fetch impact report");
    return res.json();
  },

  async comparePolicy(id: number) {
    const res = await fetch(`${API_BASE}/policies/${id}/compare`);
    if (!res.ok) throw new Error("Failed to fetch policy comparison");
    return res.json();
  },

  async getLocalImpact(id: number, wardName: string) {
    const res = await fetch(`${API_BASE}/policies/${id}/local-impact?ward_name=${encodeURIComponent(wardName)}`);
    if (!res.ok) throw new Error("Failed to fetch local impact");
    return res.json();
  },

  // Chat RAG
  async askChatbot(payload: { question: string; policy_id?: number; language?: string }) {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to get response from JanVaani");
    return res.json();
  },

  // GIS
  async getGeoJSON() {
    const res = await fetch(`${API_BASE}/gis/geojson`);
    if (!res.ok) throw new Error("Failed to fetch GeoJSON");
    return res.json();
  },

  async getWards() {
    const res = await fetch(`${API_BASE}/gis/wards`);
    if (!res.ok) throw new Error("Failed to fetch wards");
    return res.json();
  },

  async getWardPolicies(wardNumber: number) {
    const res = await fetch(`${API_BASE}/gis/wards/${wardNumber}/policies`);
    if (!res.ok) throw new Error("Failed to fetch ward policies");
    return res.json();
  },

  // Sentiment
  async getSentiment(policyId: number) {
    const res = await fetch(`${API_BASE}/sentiment/${policyId}`);
    if (!res.ok) throw new Error("Failed to fetch sentiment");
    return res.json();
  },

  async submitSentiment(payload: {
    policy_id: number;
    stance: string;
    comment?: string;
    ward_number?: number;
    session_token: string;
  }) {
    const res = await fetch(`${API_BASE}/sentiment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to submit sentiment");
    return res.json();
  },

  // Quadratic Voting
  async getQuadraticTopics(sessionToken: string = "default_user") {
    const res = await fetch(`${API_BASE}/quadratic-voting/topics?session_token=${sessionToken}`);
    if (!res.ok) throw new Error("Failed to fetch quadratic voting topics");
    return res.json();
  },

  async castQuadraticVotes(payload: {
    session_token: string;
    allocations: Array<{ topic_id: number; credits_allocated: number }>;
  }) {
    const res = await fetch(`${API_BASE}/quadratic-voting/cast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || "Failed to cast quadratic votes");
    }
    return res.json();
  },

  // Citizen Response
  async generateCitizenDraft(payload: {
    policy_id: number;
    session_token: string;
    response_type: string;
    citizen_position: string;
    concerns: string;
    user_ward?: string;
    specific_points?: string;
  }) {
    const res = await fetch(`${API_BASE}/citizen-response/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to generate response draft");
    return res.json();
  },

  // Alerts
  async getAlerts(params: { category?: string; alert_type?: string } = {}) {
    const query = new URLSearchParams();
    if (params.category) query.append("category", params.category);
    if (params.alert_type) query.append("alert_type", params.alert_type);

    const res = await fetch(`${API_BASE}/alerts?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch alerts");
    return res.json();
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`);
    if (!res.ok) throw new Error("Failed to fetch admin stats");
    return res.json();
  },

  async getAdminDocuments() {
    const res = await fetch(`${API_BASE}/admin/documents`);
    if (!res.ok) throw new Error("Failed to fetch documents");
    return res.json();
  },

  async getDocumentChunks(docId: number) {
    const res = await fetch(`${API_BASE}/admin/documents/${docId}/chunks`);
    if (!res.ok) throw new Error("Failed to fetch chunks");
    return res.json();
  },

  async uploadDocument(formData: FormData) {
    const res = await fetch(`${API_BASE}/admin/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to upload document");
    }
    return res.json();
  }
};
