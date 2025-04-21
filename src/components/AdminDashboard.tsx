import React, { useState } from 'react';
import { Company } from '@/types/frontend.models';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import CompanyList from './admin/CompanyList';
import CompanyForm from './admin/CompanyForm';
import { useSession } from '@/hooks/useSession';
import { useToast } from '@/hooks/use-toast';

export const AdminDashboard: React.FC = () => {
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const { session } = useSession();
  const { toast } = useToast();
  
  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setIsAddingCompany(false);
  };
  
  const handleAddCompany = () => {
    setEditingCompany(null);
    setIsAddingCompany(true);
  };
  
  const handleCancel = () => {
    setEditingCompany(null);
    setIsAddingCompany(false);
  };
  
  const handleSaveComplete = () => {
    toast({
      title: editingCompany ? "Company Updated" : "Company Added",
      description: `The company has been successfully ${editingCompany ? 'updated' : 'added'}.`,
      variant: "default",
    });
    setEditingCompany(null);
    setIsAddingCompany(false);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Companies</h1>
        {session && !isAddingCompany && !editingCompany && (
          <Button onClick={handleAddCompany}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        )}
      </div>
      
      {(isAddingCompany || editingCompany) ? (
        <Card>
          <CardHeader>
            <CardTitle>{isAddingCompany ? 'Add New Company' : 'Edit Company'}</CardTitle>
            <CardDescription>
              {isAddingCompany 
                ? 'Add a new AI marketing company to the database.' 
                : 'Edit the selected company details.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompanyForm 
              company={editingCompany || undefined} 
              onCancel={handleCancel}
              onSuccess={handleSaveComplete}
              isEditing={!!editingCompany}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Companies</CardTitle>
            <CardDescription>
              Find AI companies to help my ads and marketing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompanyList onEditCompany={handleEditCompany} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
