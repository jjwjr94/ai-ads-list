import React, { useState, useMemo } from 'react';
import { Company } from '@/types/frontend.models';
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
import { Trash2, Edit, RefreshCw, Search, ArrowUpDown, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/ui/logo";
import { useSession } from '@/hooks/useSession';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CompanyCard from '@/components/ui/company-card';

interface CompanyListProps {
  onEditCompany: (company: Company) => void;
}

type SortField = 'name' | 'category';
type SortDirection = 'asc' | 'desc';

export const CompanyList: React.FC<CompanyListProps> = ({ onEditCompany }) => {
  const { companies, deleteCompany, refreshCompanies, isLoading } = useCompanyDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const { session } = useSession();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

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

  const getCategoryPath = (category: string): string => {
    switch(category) {
      case "STRATEGY_PLANNING":
        return "/strategy-planning";
      case "CREATIVE_CONTENT":
        return "/creative-content";
      case "PERFORMANCE_MEDIA":
        return "/performance-media";
      case "SEO_ORGANIC":
        return "/seo-organic";
      case "DATA_ANALYTICS":
        return "/data-analytics";
      case "WEB_APP_DEVELOPMENT":
        return "/web-app-development";
      case "ACCOUNT_MANAGEMENT":
        return "/account-management";
      case "SOCIAL_MEDIA":
        return "/social-media";
      case "INFLUENCER_MARKETING":
        return "/influencer-marketing";
      case "BRAND_MANAGEMENT":
        return "/brand-management";
      case "AD_FRAUD":
        return "/ad-fraud";
      case "AI_NATIVE":
        return "/ai-native";
      default:
        return "/";
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
        {session && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={refreshCompanies}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
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
            {session && <TableHead className="w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAndFilteredCompanies.length > 0 ? (
            sortedAndFilteredCompanies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <Logo 
                    src={company.logoUrl} 
                    alt={company.name}
                    size="sm"
                    company={company as Company}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-medium hover:text-purple-600"
                    onClick={() => setSelectedCompany(company as Company)}
                  >
                    {company.name}
                  </Button>
                </TableCell>
                <TableCell>
                  <Link 
                    to={getCategoryPath(company.category)}
                    className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
                  >
                    {company.category.replace(/_/g, ' ')}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </TableCell>
                <TableCell className="max-w-md truncate">{company.description}</TableCell>
                {session && (
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => onEditCompany(company as Company)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteCompany(company.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={session ? 5 : 4} className="text-center">
                {isLoading ? 'Loading companies...' : 'No companies found'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Sheet open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        <SheetContent className="w-[90%] sm:w-[600px]">
          <SheetHeader>
            <SheetTitle>Company Details</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {selectedCompany && (
              <CompanyCard company={selectedCompany} />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default CompanyList;
