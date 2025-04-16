// Initial companies data for AI Ads Zen Garden
// This file contains validated AI-native companies across different marketing categories

import { Company, Category } from '../types/database';
import { v4 as uuidv4 } from 'uuid';

// Copywriting companies
export const copywritingCompanies: Company[] = [
  {
    id: uuidv4(),
    name: "Jasper.ai",
    website: "https://www.jasper.ai",
    logoUrl: "/logos/jasper.png",
    category: Category.COPYWRITING,
    description: "Jasper is an AI content platform that helps marketing teams create high-quality content faster. It uses GPT-4 technology to generate blog posts, social media content, marketing copy, and more.",
    features: [
      "AI-powered content generation",
      "Templates for various content types",
      "Brand voice customization",
      "Plagiarism checker",
      "Multi-language support"
    ],
    targetAudience: "Marketing teams, content creators, and businesses of all sizes",
    pricing: "Starting at $49/month for individuals, with team plans available",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: true,
      foundedAfter2020: true,
      seriesAOrEarlier: true
    }
  },
  {
    id: uuidv4(),
    name: "Copy.ai",
    website: "https://www.copy.ai",
    logoUrl: "/logos/copy.png",
    category: Category.COPYWRITING,
    description: "Copy.ai is an AI-powered copywriting tool that helps businesses create marketing copy, social media content, and product descriptions. It uses advanced language models to generate creative and engaging content.",
    features: [
      "AI copywriting for various formats",
      "Multiple language support",
      "Team collaboration features",
      "Content templates",
      "Brand voice customization"
    ],
    targetAudience: "Marketers, entrepreneurs, and small to medium-sized businesses",
    pricing: "Free plan available, Pro plan starts at $36/month",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: true,
      foundedAfter2020: true,
      seriesAOrEarlier: true
    }
  },
  {
    id: uuidv4(),
    name: "Hypotenuse.ai",
    website: "https://www.hypotenuse.ai",
    logoUrl: "/logos/hypotenuse.png",
    category: Category.COPYWRITING,
    description: "Hypotenuse.ai is an AI writing tool that specializes in e-commerce product descriptions and marketing content. It can generate high-quality content from just a few keywords.",
    features: [
      "Product description generation",
      "Blog post writing",
      "Bulk content creation",
      "SEO optimization",
      "Image generation integration"
    ],
    targetAudience: "E-commerce businesses, online retailers, and digital marketers",
    pricing: "Starting at $29/month for the Starter plan",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: true,
      foundedAfter2020: true,
      seriesAOrEarlier: true
    }
  },
  {
    id: uuidv4(),
    name: "Copysmith.ai",
    website: "https://www.copysmith.ai",
    logoUrl: "/logos/copysmith.png",
    category: Category.COPYWRITING,
    description: "Copysmith.ai is an AI-powered content creation platform designed for e-commerce and enterprise teams. It helps create product descriptions, ads, blog posts, and more at scale.",
    features: [
      "Bulk content generation",
      "Enterprise-grade collaboration",
      "API access",
      "Content templates",
      "Plagiarism checking"
    ],
    targetAudience: "E-commerce businesses, enterprise marketing teams, and agencies",
    pricing: "Starting at $19/month for individuals, with team and enterprise plans available",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: true,
      foundedAfter2020: true,
      seriesAOrEarlier: true
    }
  },
  {
    id: uuidv4(),
    name: "Peppertype.ai",
    website: "https://www.peppertype.ai",
    logoUrl: "/logos/peppertype.png",
    category: Category.COPYWRITING,
    description: "Peppertype.ai is an AI content generator that helps create content for blogs, social media, and ads. It's designed to help marketers and content creators produce high-quality content quickly.",
    features: [
      "Content ideation",
      "Blog writing assistance",
      "Social media content creation",
      "Ad copy generation",
      "Content repurposing"
    ],
    targetAudience: "Content marketers, social media managers, and small to medium businesses",
    pricing: "Starting at $25/month for the Solo plan",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: true,
      foundedAfter2020: false,
      seriesAOrEarlier: true
    }
  }
];

// SEO Tools
export const seoCompanies: Company[] = [
  {
    id: uuidv4(),
    name: "Reword.ai",
    website: "https://www.reword.ai",
    logoUrl: "/logos/reword.png",
    category: Category.SEO,
    description: "Reword.ai is an AI-powered content optimization tool that helps improve SEO performance by rewriting and enhancing existing content to make it more search-engine friendly.",
    features: [
      "Content rewriting",
      "SEO optimization",
      "Readability improvement",
      "Keyword integration",
      "Plagiarism checking"
    ],
    targetAudience: "SEO professionals, content marketers, and website owners",
    pricing: "Starting at $29/month for the Basic plan",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: true,
      foundedAfter2020: null,
      seriesAOrEarlier: null
    }
  },
  {
    id: uuidv4(),
    name: "AlliAI",
    website: "https://www.alliai.com",
    logoUrl: "/logos/alliai.png",
    category: Category.SEO,
    description: "AlliAI is an automated SEO platform that uses artificial intelligence to help businesses improve their search engine rankings. It provides comprehensive SEO analysis and recommendations.",
    features: [
      "Automated SEO audits",
      "Keyword research and tracking",
      "Competitor analysis",
      "Content optimization suggestions",
      "Backlink monitoring"
    ],
    targetAudience: "Digital marketers, SEO agencies, and businesses looking to improve their online visibility",
    pricing: "Starting at $99/month for small businesses",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: true,
      foundedAfter2020: false,
      seriesAOrEarlier: null
    }
  }
];

// Social Media Management Platforms
export const socialMediaCompanies: Company[] = [
  {
    id: uuidv4(),
    name: "Predis.ai",
    website: "https://www.predis.ai",
    logoUrl: "/logos/predis.png",
    category: Category.SOCIAL_MEDIA,
    description: "Predis.ai is an AI-powered social media marketing platform that helps create, schedule, and analyze social media content. It uses AI to generate engaging posts with minimal input.",
    features: [
      "AI content generation for social media",
      "Visual content creation",
      "Content calendar and scheduling",
      "Performance analytics",
      "Hashtag recommendations"
    ],
    targetAudience: "Social media managers, small businesses, and content creators",
    pricing: "Starting at $19/month for individuals",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: true,
      foundedAfter2020: true,
      seriesAOrEarlier: true
    }
  },
  {
    id: uuidv4(),
    name: "Lately.ai",
    website: "https://www.lately.ai",
    logoUrl: "/logos/lately.png",
    category: Category.SOCIAL_MEDIA,
    description: "Lately.ai is an AI-powered social media content management platform that automatically transforms long-form content into dozens of social posts. It learns what messaging performs best and optimizes future content.",
    features: [
      "Content atomization",
      "AI-powered writing",
      "Social media scheduling",
      "Performance analytics",
      "Brand voice customization"
    ],
    targetAudience: "Marketing teams, enterprises, and agencies",
    pricing: "Starting at $49/month for individuals, with team and enterprise plans available",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: true,
      foundedAfter2020: false,
      seriesAOrEarlier: true
    }
  }
];

// Analytics and Marketing Platforms
export const analyticsCompanies: Company[] = [
  {
    id: uuidv4(),
    name: "Prescient.ai",
    website: "https://www.prescient.ai",
    logoUrl: "/logos/prescient.png",
    category: Category.ANALYTICS,
    description: "Prescient.ai is an AI-powered marketing attribution platform that helps brands optimize their ad spend across channels. It provides accurate attribution and predictive analytics for marketing campaigns.",
    features: [
      "Multi-touch attribution",
      "Predictive analytics",
      "Ad spend optimization",
      "Customer journey mapping",
      "ROI forecasting"
    ],
    targetAudience: "E-commerce brands, DTC companies, and marketing teams",
    pricing: "Custom pricing based on ad spend",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: true,
      foundedAfter2020: true,
      seriesAOrEarlier: true
    }
  },
  {
    id: uuidv4(),
    name: "Virtue.ai",
    website: "https://www.virtue.ai",
    logoUrl: "/logos/virtue.png",
    category: Category.ANALYTICS,
    description: "Virtue.ai is an AI-powered privacy-preserving analytics platform that helps companies gain insights from their data while maintaining user privacy and security.",
    features: [
      "Privacy-preserving analytics",
      "Customer behavior insights",
      "Predictive modeling",
      "Data visualization",
      "Compliance management"
    ],
    targetAudience: "Enterprise companies, data-driven organizations, and privacy-conscious businesses",
    pricing: "Enterprise pricing, contact for details",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: true,
      foundedAfter2020: null,
      seriesAOrEarlier: true
    }
  },
  {
    id: uuidv4(),
    name: "Pecan.ai",
    website: "https://www.pecan.ai",
    logoUrl: "/logos/pecan.png",
    category: Category.ANALYTICS,
    description: "Pecan.ai is a predictive analytics platform that automates the process of building and deploying AI models. It helps businesses predict customer behavior, churn, and lifetime value.",
    features: [
      "Automated predictive modeling",
      "Customer behavior prediction",
      "Churn prediction",
      "LTV forecasting",
      "No-code interface"
    ],
    targetAudience: "Business analysts, marketing teams, and data-driven organizations",
    pricing: "Custom pricing based on data volume and use case",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: true,
      foundedAfter2020: false,
      seriesAOrEarlier: false
    }
  },
  {
    id: uuidv4(),
    name: "Faraday.ai",
    website: "https://www.faraday.ai",
    logoUrl: "/logos/faraday.png",
    category: Category.ANALYTICS,
    description: "Faraday.ai is a consumer prediction platform that helps businesses understand, predict, and influence customer behavior using AI and machine learning.",
    features: [
      "Customer prediction models",
      "Audience segmentation",
      "Behavioral analytics",
      "Personalization engine",
      "Integration with marketing tools"
    ],
    targetAudience: "B2C companies, marketing teams, and customer experience professionals",
    pricing: "Custom pricing based on data volume and use cases",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: true,
      foundedAfter2020: false,
      seriesAOrEarlier: false
    }
  },
  {
    id: uuidv4(),
    name: "Ocurate.ai",
    website: "https://www.ocurate.ai",
    logoUrl: "/logos/ocurate.png",
    category: Category.ANALYTICS,
    description: "Ocurate.ai is an AI-powered customer lifetime value prediction platform that helps B2C companies identify their highest-value customers and optimize acquisition and retention strategies.",
    features: [
      "Customer LTV prediction",
      "High-value customer identification",
      "Acquisition optimization",
      "Retention strategy recommendations",
      "Marketing ROI improvement"
    ],
    targetAudience: "B2C companies, e-commerce businesses, and subscription services",
    pricing: "Custom pricing based on business size and needs",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: true,
      foundedAfter2020: true,
      seriesAOrEarlier: true
    }
  },
  {
    id: uuidv4(),
    name: "Retina.ai",
    website: "https://www.retina.ai",
    logoUrl: "/logos/retina.png",
    category: Category.ANALYTICS,
    description: "Retina.ai is a customer intelligence platform that helps brands calculate customer lifetime value and identify high-value customers early in their journey.",
    features: [
      "Customer LTV calculation",
      "Early high-value customer identification",
      "Cohort analysis",
      "Marketing optimization",
      "Predictive analytics"
    ],
    targetAudience: "E-commerce brands, DTC companies, and marketing teams",
    pricing: "Custom pricing based on business size and data volume",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: true,
      foundedAfter2020: false,
      seriesAOrEarlier: true
    }
  },
  {
    id: uuidv4(),
    name: "Voyantis.ai",
    website: "https://www.voyantis.ai",
    logoUrl: "/logos/voyantis.png",
    category: Category.ANALYTICS,
    description: "Voyantis.ai is an AI-driven growth platform for customer acquisition and lifecycle optimization. It helps companies identify and acquire high-value users early in their journey.",
    features: [
      "Predictive user acquisition",
      "LTV-based optimization",
      "Signal enrichment",
      "Marketing campaign optimization",
      "Integration with ad platforms"
    ],
    targetAudience: "Growth marketers, user acquisition teams, and subscription businesses",
    pricing: "Custom pricing based on ad spend and business size",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: true,
      foundedAfter2020: true,
      seriesAOrEarlier: false
    }
  },
  {
    id: uuidv4(),
    name: "Kubit.ai",
    website: "https://www.kubit.ai",
    logoUrl: "/logos/kubit.png",
    category: Category.ANALYTICS,
    description: "Kubit.ai is a self-service product analytics platform that uses AI to help businesses understand user behavior and improve product experiences without requiring data science expertise.",
    features: [
      "Self-service analytics",
      "User behavior insights",
      "Anomaly detection",
      "Automated insights",
      "No-code interface"
    ],
    targetAudience: "Product managers, marketing teams, and business analysts",
    pricing: "Starting at $1,000/month for growing businesses",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: true,
      foundedAfter2020: false,
      seriesAOrEarlier: true
    }
  },
  {
    id: uuidv4(),
    name: "GetReal Labs",
    website: "https://www.getreallabs.com",
    logoUrl: "/logos/getreallabs.png",
    category: Category.ANALYTICS,
    description: "GetReal Labs is an AI-powered market research platform that helps brands understand consumer sentiment and behavior through real-time insights and analysis.",
    features: [
      "Real-time consumer insights",
      "Sentiment analysis",
      "Trend identification",
      "Competitive intelligence",
      "Brand health monitoring"
    ],
    targetAudience: "Brand managers, market researchers, and marketing strategists",
    pricing: "Custom pricing based on research needs",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: false,
      foundedAfter2020: null,
      seriesAOrEarlier: true
    }
  },
  {
    id: uuidv4(),
    name: "MarketLeap",
    website: "https://www.marketleap.ai",
    logoUrl: "/logos/marketleap.png",
    category: Category.ANALYTICS,
    description: "MarketLeap is an AI-powered competitive intelligence platform that helps businesses track competitors, monitor market trends, and identify growth opportunities.",
    features: [
      "Competitive tracking",
      "Market trend analysis",
      "Growth opportunity identification",
      "Automated reporting",
      "Strategic recommendations"
    ],
    targetAudience: "Marketing strategists, business development teams, and product managers",
    pricing: "Starting at $499/month for small businesses",
    details: {},
    aiNativeCriteria: {
      hasDotAiDomain: true,
      foundedAfter2020: null,
      seriesAOrEarlier: true
    }
  }
];

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
  ...socialMediaCompanies,
  ...analyticsCompanies,
  ...strategyPlanningCompanies,
  ...creativeContentCompanies,
  ...performanceMediaCompanies,
  ...seoOrganicCompanies,
  ...dataAnalyticsCompanies
];
