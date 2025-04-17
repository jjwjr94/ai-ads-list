import React, { useState } from 'react';
import { Company } from '@/types/frontend.models';
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

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('companies');
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  
  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setIsAddingCompany(false);
    setActiveTab('edit');
  };
  
  const handleAddCompany = () => {
    setEditingCompany(null);
    setIsAddingCompany(true);
    setActiveTab('edit');
  };
  
  const handleCancel = () => {
    setEditingCompany(null);
    setIsAddingCompany(false);
    setActiveTab('companies');
  };
  
  const handleSaveComplete = () => {
    setEditingCompany(null);
    setIsAddingCompany(false);
    setActiveTab('companies');
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Companies Database</h1>
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
              <CompanyForm 
                company={editingCompany} 
                onCancel={handleCancel}
                onSave={handleSaveComplete}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
