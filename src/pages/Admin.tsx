
import { Button } from "@/components/ui/button";
import { CompanyProvider } from '../context/CompanyContext';
import AdminDashboard from '../components/AdminDashboard';
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { toast } = useToast();

  return (
    <CompanyProvider>
      <AdminDashboard />
    </CompanyProvider>
  );
};

export default Admin;
