
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CompanyProvider } from '../context/CompanyContext';
import AdminDashboard from '../components/AdminDashboard';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      }
    };
    
    checkAuth();
  }, [navigate]);

  return (
    <CompanyProvider>
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1F2C]">
            Companies <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">Database</span>
          </h1>
          <Button 
            variant="outline"
            onClick={() => {
              supabase.auth.signOut();
              navigate('/auth');
            }}
          >
            Sign Out
          </Button>
        </div>
        
        <AdminDashboard />
      </div>
    </CompanyProvider>
  );
};

export default Admin;
