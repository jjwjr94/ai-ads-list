
import { Button } from "@/components/ui/button";
import { CompanyProvider } from '../context/CompanyContext';
import AdminDashboard from '../components/AdminDashboard';

const Admin = () => {
  return (
    <CompanyProvider>
      <AdminDashboard />
    </CompanyProvider>
  );
};

export default Admin;
