
import { Button } from "@/components/ui/button";
import { CompanyProvider } from '../context/CompanyContext';
import AdminDashboard from '../components/AdminDashboard';
import { RefreshCw, Trash2 } from "lucide-react";
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
      
      // Clear all image caches more aggressively
      const imgElements = document.querySelectorAll('img');
      imgElements.forEach(img => {
        if (img.src) {
          if (!img.src.startsWith('data:')) { // Skip base64 images
            // Force reload the image with cache busting
            const url = new URL(img.src);
            url.searchParams.set('t', timestamp.toString());
            
            // Re-assign the src to force a reload
            img.src = 'about:blank'; // First clear the src
            setTimeout(() => {
              img.src = url.toString(); // Then set the new URL
            }, 10);
          }
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

  // Function to clear browser cache completely (storage, cookies, etc)
  const handleClearAllCache = async () => {
    setRefreshing(true);
    
    try {
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear cookies (only the ones we can)
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
      
      // Clear cache for images
      const imgElements = document.querySelectorAll('img');
      imgElements.forEach(img => {
        if (img.src && !img.src.startsWith('data:')) {
          img.src = 'about:blank';
        }
      });

      // Force a hard refresh of the page
      toast({
        title: "Full cache cleared",
        description: "All browser storage and caches have been cleared.",
        action: <ToastAction altText="OK">OK</ToastAction>,
      });
      
      // Wait before resetting state
      setTimeout(() => {
        setRefreshing(false);
        window.location.reload(true); // Hard reload
      }, 1000);
    } catch (error) {
      console.error("Error clearing cache:", error);
      toast({
        title: "Cache clear failed",
        description: "Failed to clear browser cache. Please try again.",
        variant: "destructive",
      });
      setRefreshing(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2 p-4 bg-white border-b">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> 
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
        
        <Button 
          variant="destructive" 
          size="sm"
          onClick={handleClearAllCache}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" /> 
          Clear All Cache
        </Button>
      </div>
      <CompanyProvider>
        <AdminDashboard />
      </CompanyProvider>
    </>
  );
};

export default Admin;
