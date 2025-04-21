import { Category } from '../../types/frontend.models';
import type { Database } from '../../integrations/supabase/types';

export const categoryMapping: Record<Category, Database['public']['Enums']['company_category']> = {
  "Strategy & Planning": "Strategy & Planning",
  "Creative & Content": "Creative & Content",
  "Performance & Media Buying": "Performance & Media Buying",
  "SEO & Organic Growth": "SEO & Organic Growth", 
  "Data & Analytics": "Data & Analytics",
  "Web & App Development": "Web & App Development",
  "Account Management & Client Services": "Account Management & Client Services",
  "Social Media & Community Management": "Social Media & Community Management",
  "Influencer & Partnership Marketing": "Influencer & Partnership Marketing",
  "Brand Management": "Brand Management",
  "Ad Fraud Detection & Prevention": "Ad Fraud Detection & Prevention",
  "AI-Native Agencies": "AI-Native Agencies",
  "B2B & Lead Gen": "B2B & Lead Gen", 
  "Campaign Operations": "Campaign Operations", 
  "Ecommerce": "Ecommerce",
  "Simulation/Forecasting": "Simulation/Forecasting",
  "Affiliate": "Affiliate"
};
