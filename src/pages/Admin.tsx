
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
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1F2C]">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">Dashboard</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Manage AI marketing companies database
          </p>
        </div>

        <div className="flex justify-end mb-6">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Refresh Data
              </>
            )}
          </Button>
        </div>
        
        <AdminDashboard />
      </div>
    </CompanyProvider>
  );
};

export default Admin;
