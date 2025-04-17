import { Category } from '@/types/frontend.models';
import { CategoryPage } from '@/components/ui/category-page';

export const StrategyPlanningPage = () => <CategoryPage category={Category.STRATEGY_PLANNING} />;
export const CreativeContentPage = () => <CategoryPage category={Category.CREATIVE_CONTENT} />;
export const PerformanceMediaPage = () => <CategoryPage category={Category.PERFORMANCE_MEDIA} />;
export const SeoOrganicPage = () => <CategoryPage category={Category.SEO_ORGANIC} />;
export const AnalyticsPage = () => <CategoryPage category={Category.DATA_ANALYTICS} />;
export const WebAppDevelopmentPage = () => <CategoryPage category={Category.WEB_APP_DEVELOPMENT} />;
export const SocialMediaPage = () => <CategoryPage category={Category.SOCIAL_MEDIA} />;

// Note: The following pages have been removed as they reference categories
// that don't exist in the database:
// - AccountManagementPage
// - InfluencerMarketingPage
// - BrandManagementPage
// - AdFraudPage
// - AiNativePage
