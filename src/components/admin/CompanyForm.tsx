import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, X, PlusCircle, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Company, Category, CompanyCreate } from '@/types/frontend.models';
import { useCompanyDatabase } from '@/context/CompanyContext';
import LogoUploader from './LogoUploader';

// Default empty company for new company form
const defaultCompany: Partial<Company> = {
  name: '',
  website: '',
  category: Category.STRATEGY_PLANNING,
};

const emptyCompany: Company = {
  id: '',
  name: '',
  website: '',
  category: Category.STRATEGY_PLANNING,
  logoUrl: '',
  description: '',
  targetAudience: '',
  features: [''],
  pricing: '',
  details: {
    summary: '',
    highlighted: false,
    features: [],
    pricing: '',
    bestFor: ''
  }
};

// Form schema validation
// Form schema validation
const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  website: z.string().url({ message: 'Please enter a valid URL' }),
  category: z.string(),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  logoUrl: z.string().optional(),
  targetAudience: z.string().optional(),
  features: z.array(z.string()),
  pricing: z.string().optional(),
  foundedYear: z.number().optional(),
  headquarters: z.string().optional(),
  // Fix: Allow employeeCount to be null or undefined
  employeeCount: z.union([z.string(), z.null(), z.undefined()]).optional(),
  // Also fix any other fields that might have similar issues
  fundingStage: z.union([z.string(), z.null(), z.undefined()]).optional(),
  details: z.object({
    summary: z.string().optional(),
    highlighted: z.boolean().default(false),
    features: z.array(z.string()).optional(),
    pricing: z.string().optional(),
    bestFor: z.string().optional(),
  }),
});

type CompanyFormProps = {
  company?: Company;
  onSuccess?: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
};

const CompanyForm: React.FC<CompanyFormProps> = ({
  company,
  onSuccess,
  onCancel = () => {},
  isEditing = false,
}) => {
  const { addCompany, updateCompany } = useCompanyDatabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempId] = useState<string>(() => uuidv4());
  const { toast } = useToast();
  const [formChanged, setFormChanged] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<any>(null);
  const [logoChanged, setLogoChanged] = useState(false);
  
  // Create default values ensuring company.id is properly passed for editing
  const defaultValues = company ? 
    { ...company } : 
    { ...emptyCompany, id: tempId };
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Set up the form with the company data when in edit mode
  useEffect(() => {
    if (isEditing && company) {
      // Reset the form with the company data to ensure all fields are properly populated
      console.log('Setting up form with company data:', company);
      form.reset(company);
      // Store initial values to compare against later
      setInitialFormValues(JSON.stringify(company));
    }
  }, [isEditing, company, form]);

  // Track form changes to enable/disable submit button using a deep comparison approach
  useEffect(() => {
    // Set up subscription to all form values
    const subscription = form.watch((formValues) => {
      if (initialFormValues) {
        // Compare current form values with initial values to detect changes
        const currentValues = JSON.stringify(formValues);
        const hasChanged = currentValues !== initialFormValues || logoChanged;
        setFormChanged(hasChanged);
        console.log('Form changed:', hasChanged, 'Logo changed:', logoChanged);
      } else {
        // For new companies, any input means the form has changed
        setFormChanged(true);
      }
    });
    
    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [form, initialFormValues, logoChanged]);

  const onSubmit = async (data: any) => {
    console.log('Form submission triggered with data:', data);
    setIsSubmitting(true);
    try {
      if (!data.name || !data.website) {
        throw new Error('Please fill out all required fields (name and website)');
      }

      console.log('Form submission data:', data);

      if (isEditing && company) {
        console.log(`Updating company ${company.id} with:`, data);
        
        // Ensure we're using the correct ID and properly format the data
        // Create a clean update object with only the fields we want to update
        const updateData = {
          name: data.name,
          website: data.website,
          category: data.category,
          description: data.description,
          logoUrl: data.logoUrl,
          features: data.features || [],
          details: {
            summary: data.details?.summary || '',
            highlighted: data.details?.highlighted || false,
            pricing: data.details?.pricing || '',
            bestFor: data.details?.bestFor || ''
          },
          foundedYear: data.foundedYear,
          headquarters: data.headquarters,
          employeeCount: data.employeeCount || '',
          fundingStage: data.fundingStage || ''
        };
        
        console.log('Cleaned update data:', updateData);
        
        // Use a try-catch specifically for the update operation
        try {
          const result = await updateCompany(company.id, updateData);
          console.log('Update result:', result);
          
          if (result) {
            toast({
              title: "Company updated",
              description: "The company has been successfully updated.",
            });
            
            // Reset logo changed state after successful update
            setLogoChanged(false);
            
            // Call the onSuccess callback if provided
            if (onSuccess) onSuccess();
          } else {
            // Don't throw an error here, as updateCompany already handles toasts
            // Just don't call onSuccess so the form stays open
            setIsSubmitting(false);
          }
        } catch (updateError) {
          console.error('Error during update operation:', updateError);
          // updateCompany already handles toasts, so we don't need to show another one
          setIsSubmitting(false);
        }
      } else {
        // Ensure we have an ID for new companies
        const companyData = { 
          ...data, 
          id: data.id || tempId 
        };
        console.log('Adding new company with data:', companyData);
        const newCompany = await addCompany(companyData);
        
        if (newCompany) {
          toast({
            title: "Company added",
            description: "The new company has been successfully added.",
          });
          
          // Call the onSuccess callback if provided
          if (onSuccess) onSuccess();
        } else {
          toast({
            title: "Error",
            description: "Failed to add company. Please try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while saving the company.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const addFeature = () => {
    const currentFeatures = form.getValues('features') || [];
    form.setValue('features', [...currentFeatures, '']);
    setFormChanged(true);
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues('features') || [];
    form.setValue('features', currentFeatures.filter((_, i) => i !== index));
    setFormChanged(true);
  };

  // Check if the form has any validation errors
  const hasErrors = Object.keys(form.formState.errors).length > 0;
  
  // Update button should be disabled if form is submitting, has errors, or hasn't changed
  const isSubmitDisabled = isSubmitting || hasErrors || (!formChanged && !logoChanged);

  // Log the actual state of the button and validation errors for debugging
  console.log('Button state:', {
    isSubmitting,
    hasErrors,
    formChanged,
    logoChanged,
    isSubmitDisabled,
    validationErrors: form.formState.errors
  });

  return (
    <Form {...form}>
      <form onSubmit={(e) => {
        console.log('Form submit event triggered');
        form.handleSubmit(onSubmit)(e);
      }} className="space-y-6">
        {/* Hidden ID field */}
        <input
          type="hidden"
          {...form.register('id')}
        />
        
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
                      <Input 
                        placeholder="Company name" 
                        {...field} 
                        required 
                        onChange={(e) => {
                          field.onChange(e);
                          setFormChanged(true);
                        }}
                      />
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
                      <Input 
                        placeholder="https://example.com" 
                        {...field} 
                        required 
                        onChange={(e) => {
                          field.onChange(e);
                          setFormChanged(true);
                        }}
                      />
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
                      onValueChange={(value) => {
                        field.onChange(value);
                        setFormChanged(true);
                      }} 
                      defaultValue={field.value}
                      value={field.value}
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
                        value={field.value || ''}
                        onChange={(e) => {
                          field.onChange(e.target.value ? parseInt(e.target.value) : undefined);
                          setFormChanged(true);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Company Logo</h3>
            <LogoUploader 
              companyId={isEditing && company ? company.id : tempId}
              currentLogoUrl={form.watch('logoUrl')}
              onLogoUpdated={(logoUrl) => {
                form.setValue('logoUrl', logoUrl);
                setFormChanged(true);
                setLogoChanged(true); // Explicitly track logo changes
                console.log('Logo updated, setting logoChanged to true');
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
                  onChange={(e) => {
                    field.onChange(e);
                    setFormChanged(true);
                  }}
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
                  setFormChanged(true);
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
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setFormChanged(true);
                  }}
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
          <Button 
            type="submit"
            disabled={isSubmitDisabled}
            className={isSubmitDisabled ? 'opacity-50' : ''}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? 'Update Company' : 'Add Company'}
              </>
            )}
          </Button>
        </div>
        
        {/* Debug information */}
        <div className="mt-4 p-4 bg-gray-100 rounded-md text-xs">
          <h4 className="font-bold mb-2">Debug Information:</h4>
          <div>Form Changed: {formChanged ? 'Yes' : 'No'}</div>
          <div>Logo Changed: {logoChanged ? 'Yes' : 'No'}</div>
          <div>Has Errors: {hasErrors ? 'Yes' : 'No'}</div>
          <div>Is Submitting: {isSubmitting ? 'Yes' : 'No'}</div>
          <div>Button Disabled: {isSubmitDisabled ? 'Yes' : 'No'}</div>
          {hasErrors && (
            <div className="mt-2">
              <div className="font-bold text-red-500">Validation Errors:</div>
              <pre className="overflow-auto max-h-40">
                {JSON.stringify(form.formState.errors, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
};

export default CompanyForm;
