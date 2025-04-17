
import React, { useState } from 'react';
import { Company, Category } from '@/types/frontend.models';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import CompanyList from './admin/CompanyList';
import CompanyForm from './admin/CompanyForm';
import LogoUploader from './admin/LogoUploader';
import { useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('companies');
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const queryClient = useQueryClient();

  // Handle editing a company
  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setIsAddingCompany(false);
    setActiveTab('edit');
  };
  
  // Handle adding a new company
  const handleAddCompany = () => {
    // Create a temporary company with a generated ID for the logo uploader
    const newCompanyId = uuidv4();
    console.log('Creating new company with ID:', newCompanyId);
    
    const newCompany: Company = {
      id: newCompanyId,
      name: '',
      website: '',
      logoUrl: '',
      category: Category.AI_NATIVE,
      description: '',
      features: [],
      pricing: '',
      targetAudience: '',
      details: {
        summary: '',
        highlighted: false,
        features: [],
        pricing: '',
        bestFor: ''
      }
    };
    
    setEditingCompany(newCompany);
    setIsAddingCompany(true);
    setActiveTab('edit');
  };
  
  // Handle canceling edit/add
  const handleCancel = () => {
    setEditingCompany(null);
    setIsAddingCompany(false);
    setActiveTab('companies');
  };
  
  // Handle save completion
  const handleSaveComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['companies'] });
    setEditingCompany(null);
    setIsAddingCompany(false);
    setActiveTab('companies');
  };
  
  // Handle logo update
  const handleLogoUpdated = (logoUrl: string) => {
    if (editingCompany) {
      setEditingCompany({
        ...editingCompany,
        logoUrl
      });
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        {activeTab === 'companies' && (
          <Button onClick={handleAddCompany}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger 
            value="edit" 
            disabled={!isAddingCompany && !editingCompany}
          >
            {isAddingCompany ? 'Add Company' : editingCompany ? 'Edit Company' : 'Edit'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <CardTitle>Companies</CardTitle>
              <CardDescription>
                Manage AI marketing companies in the database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyList onEditCompany={handleEditCompany} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="edit">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <CompanyForm 
                    company={editingCompany} 
                    onCancel={handleCancel}
                    onSave={handleSaveComplete}
                  />
                </div>
                
                {editingCompany && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Company Logo</h3>
                    <LogoUploader 
                      companyId={editingCompany.id}
                      currentLogoUrl={editingCompany.logoUrl}
                      onLogoUpdated={handleLogoUpdated}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
