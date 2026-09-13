export interface PolicyClause {
  id: number;
  section_number: string;
  title: string;
  official_text: string;
  simple_text: string;
  page_number: number;
  clause_type: 'added' | 'removed' | 'modified' | 'standard';
  old_value?: string;
  new_value?: string;
  practical_impact?: string;
  source_citation?: string;
}

export interface Policy {
  id: number;
  code: string;
  title: string;
  department: string;
  jurisdiction?: string;
  status: 'Active' | 'Public Consultation' | 'Draft' | 'Enacted';
  effective_date: string;
  consultation_deadline?: string;
  category: string;
  summary_official: string;
  summary_simple: string;
  what_changed: string;
  who_affected: string;
  where_applies: string;
  when_takes_effect?: string;
  key_requirements?: string;
  positive_impacts?: string;
  negative_impacts?: string;
  key_statistics?: string;
  definitions?: Record<string, string>;
  clauses?: PolicyClause[];
  is_demo?: boolean;
  language?: string;
  translation_disclaimer?: string;
}

export interface Citation {
  source: string;
  department: string;
  page: number;
  section: string;
  citation: string;
  confidence: number;
  snippet: string;
}

export interface ChatResponse {
  answer: string;
  confidence_score: number;
  has_sufficient_evidence: boolean;
  citations: Citation[];
  grounded_context: string;
  disclaimer: string;
  language: string;
}

export interface Ward {
  id: number;
  ward_number: number;
  name: string;
  zone: string;
  city: string;
  pin_codes: string;
  population: number;
  area_sq_km: number;
  center: [number, number];
}

export interface SentimentData {
  policy_title: string;
  total_participants: number;
  support_pct: number;
  oppose_pct: number;
  neutral_pct: number;
  support_count: number;
  oppose_count: number;
  neutral_count: number;
  sentiment_trend: Array<{
    period: string;
    support: number;
    oppose: number;
    neutral: number;
  }>;
  recent_comments: Array<{
    stance: string;
    comment: string;
    timestamp: string;
  }>;
  disclaimer: string;
}

export interface QuadraticTopic {
  id: number;
  policy_id?: number;
  title: string;
  description: string;
  category: string;
  total_credits_spent: number;
  total_votes_cast: number;
  user_credits_spent: number;
  user_votes_awarded: number;
}

export interface QuadraticVotingState {
  max_credits: number;
  credits_used: number;
  credits_remaining: number;
  formula: string;
  topics: QuadraticTopic[];
}

export interface AlertNotification {
  id: number;
  title: string;
  message: string;
  alert_type: 'new_policy' | 'deadline' | 'council_meeting' | 'modification';
  policy_id?: number;
  category: string;
  event_date?: string;
  created_at: string;
}

export interface CitizenImpactReportSection {
  section_id: string;
  title: string;
  content: string;
  citation: string;
}

export interface CitizenImpactReport {
  report_title: string;
  policy_code: string;
  department: string;
  effective_date: string;
  consultation_deadline?: string;
  status: string;
  definitions: Record<string, string>;
  sections: CitizenImpactReportSection[];
  clauses_count: number;
  generated_at: string;
  is_authoritative_source: boolean;
  authoritative_source_note: string;
}
