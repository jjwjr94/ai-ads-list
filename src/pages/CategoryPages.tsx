
import { Category } from '@/types/frontend.models';
import { CategoryPage } from '@/components/ui/category-page';

export const StrategyPlanningPage = () => <CategoryPage category={Category.STRATEGY_PLANNING} />;
export const CreativeContentPage = () => <CategoryPage category={Category.CREATIVE_CONTENT} />;
export const PerformanceMediaPage = () => <CategoryPage category={Category.PERFORMANCE_MEDIA} />;
export const SeoOrganicPage = () => <CategoryPage category={Category.SEO_ORGANIC} />;
export const AnalyticsPage = () => <CategoryPage category={Category.DATA_ANALYTICS} />;
export const WebAppDevelopmentPage = () => <CategoryPage category={Category.WEB_APP_DEVELOPMENT} />;
export const AccountManagementPage = () => <CategoryPage category={Category.ACCOUNT_MANAGEMENT} />;
export const SocialMediaPage = () => <CategoryPage category={Category.SOCIAL_MEDIA} />;
export const InfluencerMarketingPage = () => <CategoryPage category={Category.INFLUENCER_MARKETING} />;
export const BrandManagementPage = () => <CategoryPage category={Category.BRAND_MANAGEMENT} />;
export const AdFraudPage = () => <CategoryPage category={Category.AD_FRAUD} />;
export const AiNativePage = () => <CategoryPage category={Category.AI_NATIVE} />;
