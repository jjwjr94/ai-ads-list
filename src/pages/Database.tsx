
import AdminDashboard from '../components/AdminDashboard';
import { Toaster } from "@/components/ui/toaster";
import { CompanyProvider } from '@/context/CompanyContext';

const Admin = () => {
  return (
    <CompanyProvider>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1F2C]">
            Companies
          </h1>
        </div>
        
        <AdminDashboard />
        <Toaster />
      </div>
    </CompanyProvider>
  );
};

export default Admin;
