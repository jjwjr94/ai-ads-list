import React, { useState, useEffect } from 'react';
import { Company, Category } from '@/types/database';
import { useCompanyDatabase } from '@/context/CompanyContext';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { PlusCircle, Save, X, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import LogoUploader from './LogoUploader';

interface CompanyFormProps {
  company?: Company | null;
  onCancel: () => void;
  onSave: () => void;
}

const emptyCompany: Company = {
  id: '',
  name: '',
  website: '',
  category: undefined,
  logoUrl: '',
  description: '',
  features: [],
  pricing: '',
  targetAudience: '',
  details: {
    summary: '',
    highlighted: false,
    detailFeatures: [],
    pricing: '',
    bestFor: ''
  }
};

export const CompanyForm: React.FC<CompanyFormProps> = ({ 
  company = null, 
  onCancel,
  onSave
}) => {
  const isEditing = !!company;
  const { addCompany, updateCompany } = useCompanyDatabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempId, setTempId] = useState<string>('');
  const { toast } = useToast();
  
  const defaultValues = company || { ...emptyCompany, id: uuidv4() };
  
  const form = useForm({
    defaultValues
  });

  useEffect(() => {
    if (!isEditing) {
      setTempId(uuidv4());
      form.setValue('id', tempId);
    }
  }, [isEditing, form]);

  const onSubmit = async (data: Company) => {
    setIsSubmitting(true);
    try {
      if (!data.name || !data.website) {
        throw new Error('Please fill out all required fields (name and website)');
      }

      const companyData = isEditing ? data : { ...data, id: tempId || uuidv4() };

      if (isEditing && company) {
        await updateCompany(company.id, companyData);
        toast({
          title: "Company updated",
          description: "The company has been successfully updated.",
        });
      } else {
        await addCompany(companyData);
        toast({
          title: "Company added",
          description: "The new company has been successfully added.",
        });
      }
      onSave();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while saving the company.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFeature = () => {
    const currentFeatures = form.getValues('features') || [];
    form.setValue('features', [...currentFeatures, '']);
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues('features') || [];
    form.setValue('features', currentFeatures.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Company name" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website*</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Category).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="foundedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founded Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2020" 
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <input 
              type="hidden" 
              {...form.register('logoUrl')} 
            />
            
            <input 
              type="hidden" 
              {...form.register('id')} 
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Company Logo</h3>
            <LogoUploader 
              companyId={isEditing ? company.id : tempId}
              currentLogoUrl={form.watch('logoUrl')}
              onLogoUpdated={(logoUrl) => {
                form.setValue('logoUrl', logoUrl);
              }}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief description of the company" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Features</FormLabel>
          <FormDescription>List the key features of this company</FormDescription>
          
          {form.watch('features')?.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={feature}
                onChange={(e) => {
                  const newFeatures = [...form.getValues('features')];
                  newFeatures[index] = e.target.value;
                  form.setValue('features', newFeatures);
                }}
                placeholder={`Feature ${index + 1}`}
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeFeature(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={addFeature}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
        </div>

        <FormField
          control={form.control}
          name="details.highlighted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Highlight this company</FormLabel>
                <FormDescription>
                  Featured companies will be displayed prominently on the homepage
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update Company' : 'Add Company'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CompanyForm;
