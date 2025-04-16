
import { Button } from "@/components/ui/button";
import { CompanyProvider } from '../context/CompanyContext';
import AdminDashboard from '../components/AdminDashboard';
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Admin = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // We'll use the refreshing state to show a loading indicator in the UI
      // The actual refresh functionality is handled in the AdminDashboard component
      
      toast({
        title: "Refreshing data",
        description: "Fetching the latest company data..."
      });
      
      // Allow UI to update and show the toast before we potentially get blocked
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Error triggering refresh:', error);
      toast({
        title: "Refresh failed",
        description: "There was a problem refreshing the data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <CompanyProvider>
      <AdminDashboard />
    </CompanyProvider>
  );
};

export default Admin;
