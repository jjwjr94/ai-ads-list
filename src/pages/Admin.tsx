
import { Button } from "@/components/ui/button";
import { CompanyProvider } from '../context/CompanyContext';
import AdminDashboard from '../components/AdminDashboard';
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

const Admin = () => {
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  // Function to handle manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    
    try {
      // Clear browser cache for images
      const timestamp = Date.now();
      const imgElements = document.querySelectorAll('img');
      imgElements.forEach(img => {
        if (img.src) {
          // Add or update cache-busting parameter
          const url = new URL(img.src);
          url.searchParams.set('t', timestamp.toString());
          img.src = url.toString();
        }
      });
      
      toast({
        title: "Cache cleared",
        description: "Image cache has been cleared and data will be refreshed",
        action: <ToastAction altText="OK">OK</ToastAction>,
      });

      // Wait a moment before finishing to give visual feedback
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error("Error refreshing:", error);
      toast({
        title: "Refresh failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
      setRefreshing(false);
    }
  };

  return (
    <>
      <div className="flex justify-end p-4 bg-white border-b">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> 
          {refreshing ? 'Refreshing...' : 'Refresh Data & Clear Cache'}
        </Button>
      </div>
      <CompanyProvider>
        <AdminDashboard />
      </CompanyProvider>
    </>
  );
};

export default Admin;
