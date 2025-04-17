
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
import { Trash2, Edit, RefreshCw, Search, ArrowUpDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/ui/logo";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CompanyListProps {
  onEditCompany: (company: Company) => void;
}

type SortField = 'name' | 'category';
type SortDirection = 'asc' | 'desc';

export const CompanyList: React.FC<CompanyListProps> = ({ onEditCompany }) => {
  const { deleteCompany } = useCompanyDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const queryClient = useQueryClient();

  // Use React Query for data fetching with caching
  const { data: companies = [], isLoading, refetch } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes
  });

  // Handle refresh with cache clearing
  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['companies'] });
    refetch();
    toast({
      title: "Data refreshed",
      description: "The company list has been updated with the latest data.",
    });
  };

  // Handle sort toggle
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort companies
  const sortedAndFilteredCompanies = React.useMemo(() => {
    const filtered = companies.filter(company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description?.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Handle company deletion
  const handleDeleteCompany = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await deleteCompany(id);
        queryClient.invalidateQueries({ queryKey: ['companies'] });
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
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <Table>
        <TableCaption>List of AI marketing companies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Logo</TableHead>
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
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAndFilteredCompanies.length > 0 ? (
            sortedAndFilteredCompanies.map((company) => (
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
