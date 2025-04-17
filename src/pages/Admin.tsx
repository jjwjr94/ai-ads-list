
import { Button } from "@/components/ui/button";
import { CompanyProvider } from '../context/CompanyContext';
import AdminDashboard from '../components/AdminDashboard';

const Admin = () => {
  return (
    <CompanyProvider>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1F2C]">
            Companies <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">Database</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Manage AI marketing companies database
          </p>
        </div>
        
        <AdminDashboard />
      </div>
    </CompanyProvider>
  );
};

export default Admin;
