
import { useState, useEffect, useRef } from 'react';
import { useCompanyDatabase } from '@/context/CompanyContext';
import { Company, Category } from '@/types/database';
import { v4 as uuidv4 } from 'uuid';
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { PlusCircle, Trash2, Edit, Save, X, Search, Upload, Image, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const AdminDashboard = () => {
  const { 
    companies, 
    addCompany, 
    updateCompany, 
    deleteCompany, 
    getCompaniesByCategory,
    uploadLogo,
    isLoading,
    error: dbError
  } = useCompanyDatabase();
  
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('companies');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  const form = useForm<Partial<Company>>({
    defaultValues: {
      name: '',
      url: '',
      description: '',
      category: undefined,
      details: {
        summary: '',
        features: [],
        pricing: '',
        bestFor: '',
        highlighted: false
      },
      linkedinUrl: '',
      foundedYear: undefined,
      headquarters: '',
      employeeCount: '',
      fundingStage: ''
    }
  });

  // Reset form when editingCompany changes
  useEffect(() => {
    if (editingCompany) {
      form.reset({
        name: editingCompany.name,
        url: editingCompany.url,
        description: editingCompany.description,
        category: editingCompany.category,
        details: {
          summary: editingCompany.details.summary,
          pricing: editingCompany.details.pricing,
          bestFor: editingCompany.details.bestFor,
          highlighted: editingCompany.details.highlighted || false
        },
        linkedinUrl: editingCompany.linkedinUrl,
        foundedYear: editingCompany.foundedYear,
        headquarters: editingCompany.headquarters,
        employeeCount: editingCompany.employeeCount,
        fundingStage: editingCompany.fundingStage
      });
      setFeatures(editingCompany.details.features || []);
      
      // Reset logo preview if editing
      setLogoPreview(editingCompany.logo || null);
      setLogoFile(null);
      
      // Switch to add/edit tab programmatically
      setActiveTab('add');
    } else {
      form.reset({
        name: '',
        url: '',
        description: '',
        category: undefined,
        details: {
          summary: '',
          features: [],
          pricing: '',
          bestFor: '',
          highlighted: false
        },
        linkedinUrl: '',
        foundedYear: undefined,
        headquarters: '',
        employeeCount: '',
        fundingStage: ''
      });
      setFeatures([]);
      setLogoPreview(null);
      setLogoFile(null);
    }
  }, [editingCompany, form]);

  // Show error toast if database error occurs
  useEffect(() => {
    if (dbError) {
      toast({
        title: "Database Error",
        description: dbError,
        variant: "destructive"
      });
    }
  }, [dbError, toast]);

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = async (companyId: string) => {
    if (!logoFile) return null;
    
    try {
      setIsUploading(true);
      const companyName = form.getValues('name') || 'company';
      const altText = `${companyName} logo`;
      const logoPath = await uploadLogo(companyId, logoFile, altText);
      
      toast({
        title: "Logo Uploaded",
        description: "Company logo has been successfully uploaded.",
      });
      
      return logoPath;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: Partial<Company>) => {
    try {
      setIsSubmitting(true);
      
      const companyData = {
        ...data,
        details: {
          ...data.details,
          features
        }
      } as Company;

      if (editingCompany) {
        // Handle logo upload if there's a new file
        if (logoFile) {
          const logoPath = await handleLogoUpload(editingCompany.id);
          if (logoPath) {
            companyData.logo = logoPath;
          }
        }
        
        // Update existing company
        await updateCompany(editingCompany.id, companyData);
        toast({
          title: "Company Updated",
          description: `${companyData.name} has been successfully updated.`,
        });
      } else {
        // Add new company
        const newCompany: Company = {
          ...companyData,
          id: uuidv4(),
          logo: '', // Will be updated when logo is uploaded
          lastUpdated: new Date()
        };
        
        const addedCompany = await addCompany(newCompany);
        
        // Handle logo upload if there's a file
        if (logoFile) {
          const logoPath = await handleLogoUpload(addedCompany.id);
          if (logoPath) {
            await updateCompany(addedCompany.id, { logo: logoPath });
          }
        }
        
        toast({
          title: "Company Added",
          description: `${newCompany.name} has been successfully added.`,
        });
      }

      // Reset form and state
      setEditingCompany(null);
      form.reset();
      setFeatures([]);
      setLogoFile(null);
      setLogoPreview(null);
      
      // Switch to companies tab
      setActiveTab('companies');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to save company data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (company: Company) => {
    try {
      const success = await deleteCompany(company.id);
      if (success) {
        toast({
          title: "Company Deleted",
          description: `${company.name} has been successfully deleted.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Deletion Failed",
          description: "Failed to delete company. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: "Deletion Failed",
        description: "An error occurred while deleting the company.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    // Switch to add/edit tab
    setActiveTab('add');
  };

  const handleCancel = () => {
    setEditingCompany(null);
    form.reset();
    setFeatures([]);
    setLogoFile(null);
    setLogoPreview(null);
  };

  // Filter companies based on selected category and search term
  const filteredCompanies = companies
    .filter(company => 
      selectedCategory === 'all' || company.category === selectedCategory
    )
    .filter(company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-[#1A1F2C]">
          Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">Dashboard</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Manage AI marketing companies database
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="companies">Companies List</TabsTrigger>
          <TabsTrigger value="add">Add/Edit Company</TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as Category | 'all')}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.values(Category).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableCaption>List of AI marketing companies</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Highlighted</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading companies...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCompanies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No companies found. Add some companies to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={company.logo} alt={`${company.name} logo`} />
                          <AvatarFallback>{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell>{company.category}</TableCell>
                      <TableCell className="max-w-xs truncate">{company.description}</TableCell>
                      <TableCell>{company.details.highlighted ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{new Date(company.lastUpdated).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(company)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete {company.name} from the database.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(company)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>{editingCompany ? 'Edit Company' : 'Add New Company'}</CardTitle>
              <CardDescription>
                {editingCompany 
                  ? `Editing details for ${editingCompany.name}`
                  : 'Fill in the details to add a new company to the database'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Logo Upload Section */}
                  <div className="mb-6">
                    <FormLabel>Company Logo</FormLabel>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="border rounded-md p-4 flex items-center justify-center bg-muted h-24 w-24">
                        {logoPreview ? (
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <Image className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              {logoPreview ? 'Change Logo' : 'Upload Logo'}
                            </>
                          )}
                        </Button>
                        {logoPreview && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setLogoPreview(null);
                              setLogoFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            disabled={isUploading}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        )}
                        <FormDescription>
                          Upload a high-quality logo image (PNG or SVG recommended)
                        </FormDescription>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Acme AI" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., https://acme.ai" {...field} />
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
                      name="linkedinUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn URL</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., https://linkedin.com/company/acme-ai" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of the company" 
                            className="resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="details.summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detailed Summary</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Comprehensive description of the company's offerings" 
                            className="resize-none min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormLabel>Key Features</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a feature"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddFeature}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                    <ul className="space-y-2">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <span>{feature}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFeature(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="details.pricing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pricing</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., $99/month, Enterprise pricing" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="details.bestFor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Best For</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Small agencies, Enterprise brands" {...field} />
                          </FormControl>
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
                              placeholder="e.g., 2018" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="headquarters"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Headquarters</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., San Francisco, CA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employeeCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee Count</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 50-100, 500+" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fundingStage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Funding Stage</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Series B, Bootstrapped" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                            Featured companies will be prominently displayed on category pages
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    {editingCompany && (
                      <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {editingCompany ? 'Updating...' : 'Adding...'}
                        </>
                      ) : editingCompany ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Update Company
                        </>
                      ) : (
                        <>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Company
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
