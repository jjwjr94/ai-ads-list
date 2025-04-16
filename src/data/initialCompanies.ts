import { Company, Category } from '../types/database';
import { v4 as uuidv4 } from 'uuid';

// Function to create a company object with all required fields
const createCompany = (
  name: string,
  url: string,
  description: string,
  category: Category,
  logo: string,
  summary: string,
  features: string[],
  pricing: string,
  bestFor: string,
  highlighted: boolean = false,
  linkedinUrl?: string,
  foundedYear?: number,
  headquarters?: string,
  employeeCount?: string,
  fundingStage?: string
): Company => {
  return {
    id: uuidv4(),
    name,
    url,
    description,
    category,
    logo,
    details: {
      summary,
      features,
      pricing,
      bestFor,
      highlighted
    },
    linkedinUrl,
    foundedYear,
    headquarters,
    employeeCount,
    fundingStage,
    lastUpdated: new Date()
  };
};

// Create companies for each category
export const strategyPlanningCompanies: Company[] = [
  createCompany(
    'Pecan AI',
    'https://www.pecan.ai/',
    'AI-powered predictive analytics platform that helps marketing teams forecast outcomes and optimize strategies.',
    Category.STRATEGY_PLANNING,
    '/logos/pecan_logo.png',
    'Pecan AI is a predictive analytics platform that enables marketing teams to forecast campaign performance, customer behavior, and business outcomes without requiring data science expertise. The platform automates the data preparation, feature engineering, and model creation process, making advanced predictive analytics accessible to marketing professionals.',
    [
      'Automated predictive modeling without coding',
      'Customer lifetime value prediction',
      'Churn prediction and prevention',
      'Campaign performance forecasting',
      'Marketing mix optimization',
      'Integration with existing marketing tools and data sources'
    ],
    'Enterprise pricing based on data volume and use cases',
    'Mid-market and enterprise marketing teams looking to leverage predictive analytics without data science resources',
    true,
    'https://www.linkedin.com/company/pecan-ai/',
    2018,
    'Tel Aviv, Israel',
    '50-200',
    'Series B'
  ),
  createCompany(
    'Quantive',
    'https://quantive.com/',
    'Strategic planning platform with AI capabilities for goal setting, tracking, and strategic alignment.',
    Category.STRATEGY_PLANNING,
    '/logos/quantive_logo.png',
    'Quantive (formerly Gtmhub) is a strategic planning and execution platform that helps marketing teams align on objectives, track progress, and achieve strategic goals. The platform combines OKR (Objectives and Key Results) methodology with AI-powered insights to drive better strategic outcomes and execution.',
    [
      'AI-powered strategic planning and goal setting',
      'OKR (Objectives and Key Results) tracking',
      'Strategic alignment across teams',
      'Progress visualization and reporting',
      'Integration with marketing and business tools',
      'Automated insights and recommendations'
    ],
    'Team: $9/user/month, Business: $18/user/month, Enterprise: Custom pricing',
    'Marketing teams and agencies looking to improve strategic planning and execution',
    false,
    'https://www.linkedin.com/company/quantive-strategy-execution/',
    2015,
    'Denver, Colorado',
    '200-500',
    'Series C'
  ),
  createCompany(
    'Albert.ai',
    'https://albert.ai/',
    'Autonomous marketing platform that uses AI to execute and optimize marketing strategies across channels.',
    Category.STRATEGY_PLANNING,
    '/logos/albert_logo.png',
    'Albert.ai is an autonomous marketing platform that uses artificial intelligence to execute, optimize, and analyze digital marketing campaigns across channels. The platform can autonomously handle media buying, audience targeting, creative optimization, and cross-channel allocation, freeing marketers to focus on strategy and creative development.',
    [
      'Autonomous cross-channel campaign execution',
      'AI-driven audience discovery and targeting',
      'Automated budget allocation and optimization',
      'Creative performance analysis',
      'Real-time campaign adjustments',
      'Comprehensive performance reporting'
    ],
    'Enterprise pricing based on media spend',
    'Mid-market and enterprise brands looking to automate and optimize digital marketing execution',
    true,
    'https://www.linkedin.com/company/albert-ai/',
    2010,
    'New York, NY',
    '50-200',
    'Series B'
  )
];

export const creativeContentCompanies: Company[] = [
  createCompany(
    'AdCreative.ai',
    'https://www.adcreative.ai/',
    'AI-powered platform that generates and optimizes ad creatives for better performance.',
    Category.CREATIVE_CONTENT,
    '/logos/adcreative_logo.png',
    'AdCreative.ai is an AI-powered creative generation platform that helps marketers create high-performing ad creatives at scale. The platform can generate thousands of ad variations based on your brand guidelines, analyze performance, and optimize for better results across social media and display advertising channels.',
    [
      'AI-generated ad creative production',
      'Multi-channel creative formats (Facebook, Instagram, Google, etc.)',
      'Brand guideline adherence',
      'A/B testing and performance analysis',
      'Creative performance prediction',
      'Unlimited creative generation'
    ],
    'Starter: $29/month, Pro: $59/month, Business: $149/month, Enterprise: Custom pricing',
    'Digital marketers and agencies looking to scale creative production and improve ad performance',
    true,
    'https://www.linkedin.com/company/adcreative-ai/',
    2020,
    'San Francisco, CA',
    '50-100',
    'Series A'
  ),
  createCompany(
    'Jasper.ai',
    'https://www.jasper.ai/',
    'AI content creation platform that helps marketing teams create high-quality content at scale.',
    Category.CREATIVE_CONTENT,
    '/logos/jasper_logo.png',
    'Jasper.ai is an AI content creation platform that helps marketing teams generate high-quality written content for blogs, social media, emails, ads, and more. The platform uses advanced language models to create human-like content that aligns with brand voice and marketing objectives, enabling teams to scale content production efficiently.',
    [
      'AI-powered content generation for multiple formats',
      'Brand voice customization',
      'SEO optimization integration',
      'Team collaboration features',
      'Content templates for various marketing needs',
      'Plagiarism checking and factual accuracy'
    ],
    'Creator: $49/month, Teams: $125/month, Business: Custom pricing',
    'Content marketers, agencies, and in-house marketing teams looking to scale content production',
    true,
    'https://www.linkedin.com/company/heyjasperai/',
    2021,
    'Austin, TX',
    '100-250',
    'Series A'
  ),
  createCompany(
    'Copy.ai',
    'https://www.copy.ai/',
    'AI copywriting tool that generates marketing copy for various channels and formats.',
    Category.CREATIVE_CONTENT,
    '/logos/copyai_logo.png',
    'Copy.ai is an AI copywriting tool that helps marketers generate creative copy for ads, emails, social media, product descriptions, and more. The platform offers numerous templates designed for specific marketing use cases, making it easy to quickly generate effective copy that converts.',
    [
      'AI-powered copywriting for multiple formats',
      'Marketing-specific templates and frameworks',
      '90+ languages supported',
      'Brand voice customization',
      'Team collaboration features',
      'Unlimited copy generation'
    ],
    'Free plan available, Pro: $49/month, Enterprise: Custom pricing',
    'Marketers, small businesses, and agencies looking for efficient copywriting solutions',
    false,
    'https://www.linkedin.com/company/copy-ai/',
    2020,
    'San Francisco, CA',
    '50-100',
    'Series A'
  )
];

export const performanceMediaCompanies: Company[] = [
  createCompany(
    'Smartly.io',
    'https://www.smartly.io/',
    'AI-powered social advertising platform for campaign creation, optimization, and reporting.',
    Category.PERFORMANCE_MEDIA,
    '/logos/smartly_logo.png',
    'Smartly.io is an AI-powered social advertising platform that automates and optimizes digital advertising across social channels. The platform combines creative production, campaign management, and performance optimization in one solution, helping advertisers scale their social advertising efficiently.',
    [
      'Cross-platform campaign management (Meta, TikTok, Snap, etc.)',
      'AI-driven budget allocation and optimization',
      'Automated creative production and testing',
      'Dynamic creative optimization',
      'Advanced reporting and analytics',
      'Feed-based advertising automation'
    ],
    'Enterprise pricing based on ad spend',
    'Mid-market and enterprise advertisers with significant social media ad budgets',
    true,
    'https://www.linkedin.com/company/smartly-io/',
    2013,
    'Helsinki, Finland',
    '500-1000',
    'Private'
  ),
  createCompany(
    'StackAdapt',
    'https://www.stackadapt.com/',
    'Programmatic advertising platform with AI capabilities for targeting and optimization.',
    Category.PERFORMANCE_MEDIA,
    '/logos/stackadapt_logo.png',
    'StackAdapt is a programmatic advertising platform that uses AI to help marketers reach their target audiences across display, native, video, connected TV, and audio channels. The platform offers advanced targeting capabilities, automated optimization, and comprehensive reporting to maximize campaign performance.',
    [
      'Multi-channel programmatic advertising',
      'AI-powered audience targeting',
      'Automated bid and budget optimization',
      'Custom algorithm development',
      'Self-serve and managed service options',
      'Transparent reporting and analytics'
    ],
    'Custom pricing based on media spend and service level',
    'Agencies and brands looking for comprehensive programmatic advertising solutions',
    false,
    'https://www.linkedin.com/company/stackadapt/',
    2013,
    'Toronto, Canada',
    '200-500',
    'Private'
  ),
  createCompany(
    'Rembrand',
    'https://www.rembrand.com/',
    'AI platform for media buying optimization and creative performance.',
    Category.PERFORMANCE_MEDIA,
    '/logos/rembrand_logo.png',
    'Rembrand is an AI-powered platform that optimizes media buying and creative performance for digital advertisers. The platform analyzes campaign data to identify winning creative elements, audience segments, and bidding strategies, then automatically adjusts campaigns to maximize performance and ROAS.',
    [
      'AI-driven media buying optimization',
      'Creative performance analysis',
      'Automated campaign adjustments',
      'Cross-channel attribution',
      'Audience segment discovery',
      'Performance forecasting'
    ],
    'Enterprise pricing based on media spend',
    'Performance marketers and agencies focused on maximizing ROAS',
    true,
    'https://www.linkedin.com/company/rembrand-ai/',
    2019,
    'New York, NY',
    '10-50',
    'Series A'
  )
];

export const seoOrganicCompanies: Company[] = [
  createCompany(
    'Profound',
    'https://www.tryprofound.com/',
    'AI-powered SEO platform focused on answer engine optimization and content strategy.',
    Category.SEO_ORGANIC,
    '/logos/profound_logo.png',
    'Profound is an AI-powered SEO platform that specializes in answer engine optimization (AEO) and content strategy. The platform helps marketers create content that ranks well in search engines and provides direct answers to user queries, increasing organic visibility and traffic.',
    [
      'Answer Engine Optimization (AEO)',
      'AI-driven content strategy recommendations',
      'SERP feature optimization',
      'Content gap analysis',
      'Semantic search optimization',
      'Competitive content analysis'
    ],
    'Pro: $199/month, Business: $499/month, Enterprise: Custom pricing',
    'Content marketers and SEO professionals focused on creating high-quality, search-optimized content',
    true,
    'https://www.linkedin.com/company/profound-ai/',
    2021,
    'San Francisco, CA',
    '10-50',
    'Seed'
  ),
  createCompany(
    'Surfer SEO',
    'https://surferseo.com/',
    'AI-driven SEO tool that analyzes top-performing content to guide optimization.',
    Category.SEO_ORGANIC,
    '/logos/surfer_logo.png',
    'Surfer SEO is an AI-driven content and SEO optimization tool that analyzes top-performing pages to provide data-driven recommendations for content creation and optimization. The platform helps marketers create content that ranks well by identifying the most important keywords, topics, and structural elements.',
    [
      'Content Editor with real-time optimization guidance',
      'SERP Analyzer for competitive research',
      'Content planner for topic clusters',
      'Keyword research and optimization',
      'NLP-enhanced content analysis',
      'SEO audit capabilities'
    ],
    'Basic: $69/month, Pro: $149/month, Business: $299/month, Enterprise: Custom pricing',
    'Content creators, SEO specialists, and marketing teams focused on organic search performance',
    true,
    'https://www.linkedin.com/company/surferseo/',
    2017,
    'Wrocław, Poland',
    '50-100',
    'Series A'
  ),
  createCompany(
    'Clearscope',
    'https://www.clearscope.io/',
    'AI content optimization platform that helps create SEO-friendly content.',
    Category.SEO_ORGANIC,
    '/logos/clearscope_logo.png',
    'Clearscope is an AI-powered content optimization platform that helps marketers create SEO-friendly content that ranks well in search engines. The platform analyzes top-performing content for target keywords and provides recommendations for topics, headings, and terms to include in your content.',
    [
      'Content optimization with real-time scoring',
      'Competitive content analysis',
      'Keyword discovery and research',
      'Content inventory and performance tracking',
      'Readability analysis',
      'Integration with Google Docs and WordPress'
    ],
    'Essentials: $170/month, Professional: $350/month, Enterprise: Custom pricing',
    'Content teams, SEO agencies, and enterprise marketing departments focused on content quality and search performance',
    false,
    'https://www.linkedin.com/company/clearscope/',
    2016,
    'Austin, TX',
    '10-50',
    'Bootstrapped'
  )
];

export const dataAnalyticsCompanies: Company[] = [
  createCompany(
    'Domo',
    'https://www.domo.com/',
    'Business intelligence platform with AI capabilities for data visualization and analysis.',
    Category.DATA_ANALYTICS,
    '/logos/domo_logo.png',
    'Domo is a cloud-based business intelligence platform with AI capabilities that helps marketing teams visualize, analyze, and act on their data. The platform connects to hundreds of data sources, providing real-time insights through interactive dashboards and automated reports.',
    [
      'AI-powered data analysis and insights',
      'Real-time dashboards and visualizations',
      'Marketing performance analytics',
      'Automated reporting and alerts',
      'Data integration from multiple sources',
      'Collaborative decision-making tools'
    ],
    'Standard: $83/user/month, Professional: $160/user/month, Enterprise: Custom pricing',
    'Marketing teams and agencies looking for comprehensive data visualization and analysis capabilities',
    true,
    'https://www.linkedin.com/company/domo-inc-/',
    2010,
    'American Fork, UT',
    '1000-5000',
    'Public (NASDAQ: DOMO)'
  ),
  createCompany(
    'ThoughtSpot',
    'https://www.thoughtspot.com/',
    'AI-powered analytics platform that enables natural language search of business data.',
    Category.DATA_ANALYTICS,
    '/logos/thoughtspot_logo.png',
    'ThoughtSpot is an AI-powered analytics platform that allows marketers to search and analyze their data using natural language queries. The platform makes data analysis accessible to non-technical users, enabling faster insights and data-driven decision making across marketing teams.',
    [
      'Natural language search for data analysis',
      'AI-driven insights and recommendations',
      'Interactive data visualizations',
      'Automated monitoring and alerts',
      'Embedded analytics capabilities',
      'Enterprise-grade security and governance'
    ],
    'Team Edition: $95/user/month, Pro Edition: Custom pricing, Enterprise Edition: Custom pricing',
    'Data-driven marketing teams looking for self-service analytics capabilities',
    false,
    'https://www.linkedin.com/company/thoughtspot/',
    2012,
    'Sunnyvale, CA',
    '500-1000',
    'Series F'
  ),
  createCompany(
    'Mixpanel',
    'https://mixpanel.com/',
    'Product analytics platform with AI features for user behavior analysis.',
    Category.DATA_ANALYTICS,
    '/logos/mixpanel_logo.png',
    'Mixpanel is a product analytics platform with AI capabilities that helps marketing teams analyze user behavior, engagement, and conversion. The platform provides insights into how users interact with digital products and marketing campaigns, enabling data-driven optimization.',
    [
      'User behavior analysis and segmentation',
      'Conversion funnel analysis',
      'Retention and engagement metrics',
      'A/B testing and experimentation',
      'Automated insights and anomaly detection',
      'Custom event tracking and reporting'
    ],
    'Free plan available, Growth: $25/month, Enterprise: Custom pricing',
    'Digital marketers, product managers, and growth teams focused on user engagement and conversion',
    true,
    'https://www.linkedin.com/company/mixpanel/',
    2009,
    'San Francisco, CA',
    '250-500',
    'Series C'
  )
];

export const webAppDevelopmentCompanies: Company[] = [
  createCompany(
    'Duda',
    'https://www.duda.co/',
    'AI-enhanced web design platform for agencies to build and manage websites.',
    Category.WEB_APP_DEVELOPMENT,
    '/logos/duda_logo.png',
    'Duda is an AI-enhanced web design platform that helps agencies and marketing teams build and manage professional websites at scale. The platform offers AI-powered design suggestions, content generation, and optimization tools to streamline the website development process.',
    [
      'AI-powered website builder',
      'White-label platform for agencies',
      'Team collaboration features',
      'Client management tools',
      'Content personalization',
      'Widget builder and app store'
    ],
    'Basic: $14/month, Team: $22/month, Agency: $44/month, Custom: Custom pricing',
    'Digital agencies, web professionals, and marketing teams building websites for clients',
    true,
    'https://www.linkedin.com/company/duda/',
    2009,
    'Palo Alto, CA',
    '100-250',
    'Series D'
  ),
  createCompany(
    'Builder.io',
    'https://www.builder.io/',
    'Visual development platform with AI capabilities for creating web experiences.',
    Category.WEB_APP_DEVELOPMENT,
    '/logos/builder_logo.png',
    'Builder.io is a visual development platform with AI capabilities that helps marketing teams create and optimize web experiences without coding. The platform integrates with existing tech stacks and enables non-technical users to build, test, and optimize digital experiences.',
    [
      'Visual drag-and-drop interface',
      'AI-powered design suggestions',
      'A/B testing and optimization',
      'Headless CMS capabilities',
      'Integration with existing tech stacks',
      'Multi-framework support'
    ],
    'Free plan available, Team: $99/month, Business: $499/month, Enterprise: Custom pricing',
    'Marketing teams and developers looking to collaborate on web experiences',
    false,
    'https://www.linkedin.com/company/builder-io/',
    2019,
    'San Francisco, CA',
    '10-50',
    'Series A'
  ),
  createCompany(
    'Wix ADI',
    'https://www.wix.com/',
    'AI-powered website builder that creates personalized websites based on user inputs.',
    Category.WEB_APP_DEVELOPMENT,
    '/logos/wix_logo.png',
    'Wix ADI (Artificial Design Intelligence) is an AI-powered website builder that creates personalized websites based on user inputs and preferences. The platform asks a series of questions about your business and goals, then automatically generates a custom website with appropriate design, content, and features.',
    [
      'AI-generated website designs',
      'Personalized content suggestions',
      'Responsive design for all devices',
      'Business-specific features and integrations',
      'SEO optimization tools',
      'Ongoing design and content recommendations'
    ],
    'Combo: $16/month, Unlimited: $22/month, Pro: $27/month, VIP: $45/month',
    'Small businesses, entrepreneurs, and marketers looking for quick website creation',
    true,
    'https://www.linkedin.com/company/wix-com/',
    2006,
    'Tel Aviv, Israel',
    '5000+',
    'Public (NASDAQ: WIX)'
  )
];

export const accountManagementCompanies: Company[] = [
  createCompany(
    'Workstreams.ai',
    'https://www.workstreams.ai/',
    'AI-powered account management platform for streamlining client workflows.',
    Category.ACCOUNT_MANAGEMENT,
    '/logos/workstreams_logo.png',
    'Workstreams.ai is an AI-powered account management platform that helps agencies streamline client workflows and collaboration. The platform uses AI to automate routine tasks, provide insights on client relationships, and ensure consistent service delivery across accounts.',
    [
      'AI-powered workflow automation',
      'Client communication management',
      'Task and project tracking',
      'Service delivery templates',
      'Client health scoring',
      'Performance analytics and reporting'
    ],
    'Starter: $9/user/month, Business: $19/user/month, Enterprise: Custom pricing',
    'Agencies and client service teams looking to improve account management efficiency',
    true,
    'https://www.linkedin.com/company/workstreams-ai/',
    2018,
    'Berlin, Germany',
    '10-50',
    'Series A'
  ),
  createCompany(
    'Monday.com AI',
    'https://monday.com/w/ai',
    'Work operating system with AI capabilities for client management and project tracking.',
    Category.ACCOUNT_MANAGEMENT,
    '/logos/monday_logo.png',
    'Monday.com AI is a work operating system with artificial intelligence capabilities designed to help marketing teams manage client relationships and projects. The platform uses AI to automate workflows, provide insights, and streamline collaboration between teams and clients.',
    [
      'AI-powered workflow automation',
      'Client project management',
      'Resource allocation and tracking',
      'Automated status updates and reporting',
      'Client portal and collaboration tools',
      'Custom dashboards and analytics'
    ],
    'Basic: $8/user/month, Standard: $10/user/month, Pro: $16/user/month, Enterprise: Custom pricing',
    'Marketing agencies and client service teams managing multiple client relationships and projects',
    false,
    'https://www.linkedin.com/company/monday.com/',
    2012,
    'Tel Aviv, Israel',
    '1000-5000',
    'Public (NASDAQ: MNDY)'
  ),
  createCompany(
    'Clientjoy',
    'https://www.clientjoy.io/',
    'Client management platform with AI features for agencies to manage client relationships.',
    Category.ACCOUNT_MANAGEMENT,
    '/logos/clientjoy_logo.png',
    'Clientjoy is a client management platform with AI features designed specifically for agencies to manage client relationships, proposals, contracts, and invoices. The platform uses AI to provide insights on client behavior, automate follow-ups, and streamline the client management process.',
    [
      'AI-powered client insights and recommendations',
      'Proposal and contract management',
      'Invoicing and payment tracking',
      'Client communication management',
      'Pipeline and lead tracking',
      'Performance analytics and reporting'
    ],
    'Basic: $19/user/month, Growth: $39/user/month, Scale: $79/user/month',
    'Digital agencies and freelancers looking to streamline client management',
    true,
    'https://www.linkedin.com/company/clientjoy/',
    2019,
    'Ahmedabad, India',
    '10-50',
    'Seed'
  )
];

export const socialMediaCompanies: Company[] = [
  createCompany(
    'Ocoya',
    'https://www.ocoya.com/',
    'AI-powered social media management platform for content creation and scheduling.',
    Category.SOCIAL_MEDIA,
    '/logos/ocoya_logo.png',
    'Ocoya is an AI-powered social media management platform that helps marketers create, schedule, and analyze social media content across multiple platforms. The platform uses AI to generate content ideas, optimize posting schedules, and provide performance insights.',
    [
      'AI-powered content generation',
      'Multi-platform scheduling and publishing',
      'Content calendar and planning',
      'Performance analytics and reporting',
      'Team collaboration features',
      'Content library and asset management'
    ],
    'Starter: $15/month, Pro: $42/month, Business: $82/month',
    'Social media managers and marketing teams looking to streamline content creation and management',
    true,
    'https://www.linkedin.com/company/ocoya/',
    2021,
    'London, UK',
    '10-50',
    'Seed'
  ),
  createCompany(
    'SocialBee',
    'https://socialbee.com/',
    'Social media management tool with AI capabilities for content curation and scheduling.',
    Category.SOCIAL_MEDIA,
    '/logos/socialbee_logo.png',
    'SocialBee is a social media management tool with AI capabilities for content curation, creation, and scheduling. The platform helps marketers maintain a consistent social media presence through category-based content organization, recycling, and AI-powered optimization.',
    [
      'AI-assisted content creation',
      'Category-based content organization',
      'Content recycling and evergreen posting',
      'Multi-platform scheduling and publishing',
      'Social media analytics',
      'Team collaboration features'
    ],
    'Bootstrap: $29/month, Accelerate: $49/month, Pro: $79/month',
    'Small businesses and marketing teams looking for efficient social media management',
    false,
    'https://www.linkedin.com/company/socialbee-io/',
    2016,
    'Cluj-Napoca, Romania',
    '10-50',
    'Bootstrapped'
  ),
  createCompany(
    'Hootsuite',
    'https://www.hootsuite.com/',
    'Social media management platform with AI features for content optimization and analytics.',
    Category.SOCIAL_MEDIA,
    '/logos/hootsuite_logo.png',
    'Hootsuite is a comprehensive social media management platform with AI features for content optimization, scheduling, and analytics. The platform helps marketing teams manage multiple social media accounts, collaborate on content, and measure performance across channels.',
    [
      'AI-powered content recommendations',
      'Multi-platform management and scheduling',
      'Social listening and monitoring',
      'Comprehensive analytics and reporting',
      'Team collaboration and approval workflows',
      'Integration with marketing tools and CRM systems'
    ],
    'Professional: $99/month, Team: $249/month, Business: $739/month, Enterprise: Custom pricing',
    'Marketing teams and agencies managing multiple social media accounts and campaigns',
    true,
    'https://www.linkedin.com/company/hootsuite/',
    2008,
    'Vancouver, Canada',
    '1000-5000',
    'Private'
  )
];

export const influencerMarketingCompanies: Company[] = [
  createCompany(
    'Favikon',
    'https://www.favikon.com/',
    'AI-powered influencer marketing platform for discovery and campaign management.',
    Category.INFLUENCER_MARKETING,
    '/logos/favikon_logo.png',
    'Favikon is an AI-powered influencer marketing platform that helps brands discover, vet, and collaborate with influencers. The platform uses artificial intelligence to match brands with relevant influencers based on audience demographics, engagement metrics, and content quality.',
    [
      'AI-powered influencer discovery and matching',
      'Audience analysis and verification',
      'Campaign management and tracking',
      'Performance analytics and ROI measurement',
      'Influencer relationship management',
      'Content approval and compliance monitoring'
    ],
    'Starter: $199/month, Pro: $499/month, Enterprise: Custom pricing',
    'Brands and agencies looking to run data-driven influencer marketing campaigns',
    true,
    'https://www.linkedin.com/company/favikon/',
    2019,
    'Berlin, Germany',
    '10-50',
    'Series A'
  ),
  createCompany(
    'Upfluence',
    'https://www.upfluence.com/',
    'Influencer marketing platform with AI capabilities for influencer discovery and campaign management.',
    Category.INFLUENCER_MARKETING,
    '/logos/upfluence_logo.png',
    'Upfluence is an influencer marketing platform with AI capabilities for influencer discovery, campaign management, and performance tracking. The platform helps brands identify relevant influencers, manage relationships, and measure the impact of influencer marketing campaigns.',
    [
      'AI-powered influencer search and discovery',
      'Audience demographics and psychographics analysis',
      'Campaign management and workflow automation',
      'Performance tracking and ROI measurement',
      'Influencer CRM and relationship management',
      'E-commerce integration for sales attribution'
    ],
    'Custom pricing based on features and usage',
    'Mid-market and enterprise brands running influencer marketing campaigns',
    false,
    'https://www.linkedin.com/company/upfluence/',
    2013,
    'New York, NY',
    '100-250',
    'Series A'
  ),
  createCompany(
    'Lionize.ai',
    'https://lionize.ai/',
    'AI-powered influencer marketing platform for sourcing, recruiting, and managing influencers.',
    Category.INFLUENCER_MARKETING,
    '/logos/lionize_logo.png',
    'Lionize.ai is an AI-powered influencer marketing platform that automates the process of sourcing, recruiting, and managing influencers for marketing campaigns. The platform uses artificial intelligence to identify ideal influencers, predict campaign performance, and optimize ROI.',
    [
      'AI-driven influencer identification and matching',
      'Automated outreach and recruitment',
      'Campaign management and content approval',
      'Performance tracking and analytics',
      'Payments and contract management',
      'ROI forecasting and measurement'
    ],
    'Starter: $500/month, Growth: $1,500/month, Enterprise: Custom pricing',
    'Brands and agencies looking to automate and scale influencer marketing efforts',
    true,
    'https://www.linkedin.com/company/lionize-ai/',
    2021,
    'Washington, DC',
    '10-50',
    'Seed'
  )
];

export const brandManagementCompanies: Company[] = [
  createCompany(
    'Frontify',
    'https://www.frontify.com/en/ai',
    'Brand management platform with AI capabilities for brand consistency and asset management.',
    Category.BRAND_MANAGEMENT,
    '/logos/frontify_logo.png',
    'Frontify is a brand management platform with AI capabilities that helps marketing teams maintain brand consistency and manage brand assets. The platform uses artificial intelligence to organize assets, ensure brand compliance, and streamline the brand management process.',
    [
      'AI-powered asset organization and tagging',
      'Brand guidelines management',
      'Digital asset management',
      'Brand consistency monitoring',
      'Collaboration and approval workflows',
      'Template management and customization'
    ],
    'Essential: $89/month, Advanced: $179/month, Custom: Custom pricing',
    'Marketing teams and brand managers looking to maintain brand consistency across channels',
    true,
    'https://www.linkedin.com/company/frontify/',
    2013,
    'St. Gallen, Switzerland',
    '250-500',
    'Series B'
  ),
  createCompany(
    'Bynder',
    'https://www.bynder.com/en/products/ai/',
    'Digital asset management platform with AI features for asset tagging and organization.',
    Category.BRAND_MANAGEMENT,
    '/logos/bynder_logo.png',
    'Bynder is a digital asset management platform with AI features that helps marketing teams organize, find, and use brand assets efficiently. The platform uses artificial intelligence to automatically tag assets, identify duplicates, and recommend relevant content based on user behavior.',
    [
      'AI-powered asset tagging and categorization',
      'Automated metadata generation',
      'Visual search capabilities',
      'Content recommendations and insights',
      'Brand portal and guidelines management',
      'Integration with creative and marketing tools'
    ],
    'Custom pricing based on features and usage',
    'Enterprise marketing teams managing large volumes of digital assets',
    false,
    'https://www.linkedin.com/company/bynder/',
    2013,
    'Amsterdam, Netherlands',
    '250-500',
    'Private'
  ),
  createCompany(
    'Brandfolder',
    'https://brandfolder.com/product/brand-intelligence/',
    'Brand asset management platform with AI-powered "Brand Intelligence" for asset organization.',
    Category.BRAND_MANAGEMENT,
    '/logos/brandfolder_logo.png',
    'Brandfolder is a brand asset management platform with AI-powered "Brand Intelligence" that helps marketing teams organize, manage, and distribute brand assets. The platform uses artificial intelligence to automatically tag assets, track usage, and provide insights on brand performance.',
    [
      'AI-powered asset tagging and organization',
      'Brand intelligence and insights',
      'Usage tracking and analytics',
      'Content distribution and sharing',
      'Version control and asset history',
      'Integration with creative and marketing tools'
    ],
    'Custom pricing based on features and usage',
    'Mid-market and enterprise brands managing complex brand assets',
    true,
    'https://www.linkedin.com/company/brandfolder/',
    2012,
    'Denver, CO',
    '50-200',
    'Acquired by Smartsheet'
  )
];

export const adFraudCompanies: Company[] = [
  createCompany(
    'TrafficGuard',
    'https://www.trafficguard.ai/',
    'AI-powered ad fraud protection platform that detects and prevents invalid traffic.',
    Category.AD_FRAUD,
    '/logos/trafficguard_logo.png',
    'TrafficGuard is an AI-powered ad fraud protection platform that detects and prevents invalid traffic in real-time. The platform uses machine learning to identify and block fraudulent ad impressions, clicks, and conversions before they impact campaign performance and budget.',
    [
      'Real-time fraud detection and prevention',
      'Pre-bid fraud blocking',
      'Post-click fraud analysis',
      'Multi-point verification',
      'Comprehensive reporting and analytics',
      'Integration with major ad platforms'
    ],
    'Essential: $500/month, Growth: $1,500/month, Enterprise: Custom pricing',
    'Advertisers and agencies looking to protect ad spend from fraud',
    true,
    'https://www.linkedin.com/company/trafficguardad/',
    2018,
    'Perth, Australia',
    '50-100',
    'Public (ASX: TGP)'
  ),
  createCompany(
    'Lunio',
    'https://www.lunio.ai/',
    'AI-powered ad traffic verification and protection platform for detecting fake clicks.',
    Category.AD_FRAUD,
    '/logos/lunio_logo.png',
    'Lunio is an AI-powered ad traffic verification and protection platform that helps marketers identify and block fake clicks and invalid traffic. The platform uses machine learning to analyze user behavior and traffic patterns, preventing ad fraud before it impacts campaign performance.',
    [
      'Real-time click fraud detection',
      'Invalid traffic blocking',
      'Bot detection and prevention',
      'Campaign performance protection',
      'Detailed fraud analytics and reporting',
      'Integration with major ad platforms'
    ],
    'Starter: $299/month, Growth: $599/month, Enterprise: Custom pricing',
    'Digital advertisers looking to maximize ROAS by eliminating invalid traffic',
    false,
    'https://www.linkedin.com/company/lunio-ai/',
    2018,
    'Manchester, UK',
    '50-100',
    'Series A'
  ),
  createCompany(
    'FraudScore',
    'https://fraudscore.ai/',
    'AI-powered ad fraud detection platform that analyzes traffic quality in real-time.',
    Category.AD_FRAUD,
    '/logos/fraudscore_logo.png',
    'FraudScore is an AI-powered ad fraud detection platform that analyzes traffic quality in real-time to identify and prevent various types of ad fraud. The platform uses machine learning algorithms to detect bots, click farms, and other fraudulent activities that waste ad spend.',
    [
      'Real-time traffic quality analysis',
      'Bot and fraud detection',
      'Traffic source verification',
      'Conversion fraud prevention',
      'Detailed fraud reporting and analytics',
      'API integration with ad platforms'
    ],
    'Pay-as-you-go: $0.001/event, Basic: $299/month, Pro: $999/month, Enterprise: Custom pricing',
    'Advertisers, agencies, and ad networks looking to ensure traffic quality',
    true,
    'https://www.linkedin.com/company/fraudscore/',
    2016,
    'Limassol, Cyprus',
    '10-50',
    'Private'
  )
];

export const adNativeCompanies: Company[] = [
  createCompany(
    'DEPT Agency',
    'https://www.deptagency.com/',
    'AI-native consulting, tech, and marketing agency offering comprehensive digital solutions.',
    Category.AD_NATIVE,
    '/logos/dept_logo.png',
    'DEPT Agency is an AI-native consulting, technology, and marketing agency that helps brands leverage artificial intelligence across their digital operations. The agency combines creativity, technology, and data to deliver AI-powered marketing solutions that drive business results.',
    [
      'AI strategy and implementation',
      'Creative and content production',
      'Data and analytics services',
      'Digital experience design',
      'Marketing automation',
      'Technology integration and development'
    ],
    'Custom pricing based on project scope and services',
    'Mid-market and enterprise brands looking for comprehensive AI-powered digital solutions',
    true,
    'https://www.linkedin.com/company/deptagency/',
    2015,
    'Amsterdam, Netherlands',
    '1000-5000',
    'Private'
  ),
  createCompany(
    'EPAM Empathy Lab',
    'https://www.epam.com/',
    'AI-native agency focused on commerce, marketing, and customer experience.',
    Category.AD_NATIVE,
    '/logos/epam_logo.png',
    'EPAM Empathy Lab is an AI-native agency that specializes in commerce, marketing, and customer experience solutions. The agency helps brands leverage artificial intelligence to create personalized, data-driven customer experiences across digital touchpoints.',
    [
      'AI-powered customer experience design',
      'Commerce strategy and implementation',
      'Marketing technology integration',
      'Data-driven personalization',
      'Digital product development',
      'AI strategy and roadmap development'
    ],
    'Custom pricing based on project scope and services',
    'Enterprise brands looking to transform customer experience with AI',
    false,
    'https://www.linkedin.com/company/epam-systems/',
    1993,
    'Newtown, PA',
    '10000+',
    'Public (NYSE: EPAM)'
  ),
  createCompany(
    'RZLT',
    'https://www.rzlt.io/ainative',
    'AI-native marketing agency specializing in integrating AI frameworks into strategic workflows.',
    Category.AD_NATIVE,
    '/logos/rzlt_logo.png',
    'RZLT is an AI-native marketing agency that specializes in integrating artificial intelligence frameworks into strategic marketing workflows. The agency helps brands leverage AI to optimize marketing operations, improve decision-making, and drive better business outcomes.',
    [
      'AI strategy and implementation',
      'Marketing workflow optimization',
      'Data-driven decision frameworks',
      'AI-powered content creation',
      'Performance marketing automation',
      'Marketing technology integration'
    ],
    'Custom pricing based on project scope and services',
    'Forward-thinking brands looking to transform marketing operations with AI',
    true,
    'https://www.linkedin.com/company/rzlt-io/',
    2020,
    'New York, NY',
    '10-50',
    'Private'
  )
];

// Combine all companies into a single array
export const initialCompanies: Company[] = [
  ...strategyPlanningCompanies,
  ...creativeContentCompanies,
  ...performanceMediaCompanies,
  ...seoOrganicCompanies,
  ...dataAnalyticsCompanies,
  ...webAppDevelopmentCompanies,
  ...accountManagementCompanies,
  ...socialMediaCompanies,
  ...influencerMarketingCompanies,
  ...brandManagementCompanies,
  ...adFraudCompanies,
  ...adNativeCompanies
];
