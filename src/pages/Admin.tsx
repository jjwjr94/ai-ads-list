
import { Button } from "@/components/ui/button";
import { CompanyProvider } from '../context/CompanyContext';
import AdminDashboard from '../components/AdminDashboard';

const Admin = () => {
  return (
    <CompanyProvider>
      <div className="container mx-auto py-12 px-4">
        {/* Removed the heading */}
        <AdminDashboard />
      </div>
    </CompanyProvider>
  );
};


export default Admin;
