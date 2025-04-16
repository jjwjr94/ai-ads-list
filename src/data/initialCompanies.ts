import { Company, Category } from '../types/database';
import { v4 as uuidv4 } from 'uuid';

// Remove existing arrays for removed categories
export const copywritingCompanies: Company[] = [];
export const seoCompanies: Company[] = [];
export const analyticsCompanies: Company[] = [];

// Strategy & Planning Companies
export const strategyPlanningCompanies: Company[] = [];

// Creative & Content Companies
export const creativeContentCompanies: Company[] = [];

// Performance & Media Companies
export const performanceMediaCompanies: Company[] = [];

// SEO & Organic Growth Companies
export const seoOrganicCompanies: Company[] = [];

// Data & Analytics Companies
export const dataAnalyticsCompanies: Company[] = [];

// Export all companies together
export const initialCompanies: Company[] = [
  ...copywritingCompanies,
  ...seoCompanies,
  ...analyticsCompanies,
  ...strategyPlanningCompanies,
  ...creativeContentCompanies,
  ...performanceMediaCompanies,
  ...seoOrganicCompanies,
  ...dataAnalyticsCompanies
];
