import React, { useState, useMemo } from 'react';
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
import { Trash2, Edit, RefreshCw, Search, ArrowUpDown, ImageOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/ui/logo";

interface CompanyListProps {
  onEditCompany: (company: Company) => void;
}

type SortField = 'name' | 'category';
type SortDirection = 'asc' | 'desc';

export const CompanyList: React.FC<CompanyListProps> = ({ onEditCompany }) => {
  const { companies, deleteCompany, refreshCompanies, isLoading, updateCompany } = useCompanyDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAndFilteredCompanies = useMemo(() => {
    const filtered = companies.filter(company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aValue = a[sortField]?.toLowerCase() ?? '';
      const bValue = b[sortField]?.toLowerCase() ?? '';
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      }
      return bValue.localeCompare(aValue);
    });
  }, [companies, searchTerm, sortField, sortDirection]);

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

  const handleDeleteLogo = async (company: Company) => {
    if (window.confirm('Are you sure you want to delete this company\'s logo?')) {
      try {
        await updateCompany(company.id, { 
          logo: '',
          logoUrl: '' 
        });
        toast({
          title: "Logo deleted",
          description: "The company logo has been successfully removed.",
        });
      } catch (error) {
        console.error('Error deleting logo:', error);
        toast({
          title: "Error",
          description: "An error occurred while deleting the logo.",
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
            <TableHead className="w-[100px]">Logo</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort('name')}
                className="flex items-center gap-2 hover:bg-transparent"
              >
                Name
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort('category')}
                className="flex items-center gap-2 hover:bg-transparent"
              >
                Category
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[130px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAndFilteredCompanies.length > 0 ? (
            sortedAndFilteredCompanies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Logo 
                      src={company.logoUrl || company.logo || ''} 
                      alt={company.name}
                      size="sm"
                      company={company}
                    />
                    {(company.logoUrl || company.logo) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLogo(company)}
                        className="h-8 w-8"
                      >
                        <ImageOff className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
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
