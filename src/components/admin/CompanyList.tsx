
import React, { useState } from 'react';
import { Company } from '@/types/database';
import { useCompanyDatabase } from '@/context/CompanyContext';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit, RefreshCw, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/ui/logo";

interface CompanyListProps {
  onEditCompany: (company: Company) => void;
}

export const CompanyList: React.FC<CompanyListProps> = ({ onEditCompany }) => {
  const { companies, deleteCompany, refreshCompanies, isLoading } = useCompanyDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Filter companies based on search term
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle company deletion
  const handleDeleteCompany = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await deleteCompany(id);
        toast({
          title: "Company deleted",
          description: "The company has been successfully deleted.",
        });
      } catch (error) {
        console.error('Error deleting company:', error);
        toast({
          title: "Error",
          description: "An error occurred while deleting the company.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search companies..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={refreshCompanies}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Table>
        <TableCaption>List of AI marketing companies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <Logo 
                    src={company.logoUrl || company.logo || ''} 
                    alt={company.name}
                    size="sm"
                    company={company}
                  />
                </TableCell>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.category}</TableCell>
                <TableCell className="max-w-md truncate">{company.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => onEditCompany(company)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCompany(company.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                {isLoading ? 'Loading companies...' : 'No companies found'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyList;
