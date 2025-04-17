
import React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Company } from '@/types/frontend.models';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  type: 'category' | 'company';
  title: string;
  description: string;
  path: string;
}

interface SearchDropdownProps {
  companies: Company[];
  categoryCards: Array<{
    title: string;
    path: string;
    description: string;
  }>;
  searchQuery: string;
}

export const SearchDropdown = ({ companies, categoryCards, searchQuery }: SearchDropdownProps) => {
  const navigate = useNavigate();
  
  if (!searchQuery) return null;

  const companyResults: SearchResult[] = companies
    .filter(company => 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.features?.some(feature => 
        feature.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .map(company => ({
      type: 'company' as const,
      title: company.name,
      description: company.description || '',
      path: `/${company.category.toLowerCase()}#${company.id}`
    }));

  const categoryResults: SearchResult[] = categoryCards
    .filter(card => 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map(card => ({
      type: 'category' as const,
      title: card.title,
      description: card.description,
      path: card.path
    }));

  const allResults = [...categoryResults, ...companyResults];

  return (
    <div className="relative w-full">
      <Command className="absolute top-0 w-full rounded-lg border shadow-md bg-popover">
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {categoryResults.length > 0 && (
            <CommandGroup heading="Categories">
              {categoryResults.map((result, index) => (
                <CommandItem
                  key={`category-${index}`}
                  onSelect={() => navigate(result.path)}
                  className="cursor-pointer"
                >
                  <div>
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {result.description}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {companyResults.length > 0 && (
            <CommandGroup heading="Companies">
              {companyResults.map((result, index) => (
                <CommandItem
                  key={`company-${index}`}
                  onSelect={() => navigate(result.path)}
                  className="cursor-pointer"
                >
                  <div>
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {result.description}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
};
