
import React, { useState, useEffect } from 'react';
import { useCompanyDatabase } from '@/context/CompanyContext';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image, Loader2, Trash2 } from 'lucide-react';
import { Company } from '@/types/frontend.models';

interface LogoUploaderProps {
  companyId: string;
  currentLogoUrl?: string;
  onLogoUpdated: (logoUrl: string) => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({ 
  companyId, 
  currentLogoUrl,
  onLogoUpdated
}) => {
  const { uploadLogo, updateCompany } = useCompanyDatabase();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null | undefined>(currentLogoUrl);
  const { toast } = useToast();
  
  // Update preview whenever currentLogoUrl changes
  useEffect(() => {
    if (currentLogoUrl) {
      setPreviewUrl(currentLogoUrl);
    }
  }, [currentLogoUrl]);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    // Immediately show preview from local file
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
    
    // Upload file to storage
    setIsUploading(true);
    try {
      // Only upload to storage, don't update company yet
      const logoUrl = await uploadLogo(companyId, file);
      console.log('Logo uploaded to storage with URL:', logoUrl);
      
      // Pass logoUrl to parent component to update form state
      if (logoUrl) {
        onLogoUpdated(logoUrl);
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the logo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (window.confirm('Are you sure you want to delete this company\'s logo?')) {
      try {
        // Only clear the preview and notify parent, actual update happens on form submit
        setPreviewUrl(null);
        onLogoUpdated('');
        toast({
          title: "Logo removed",
          description: "The logo has been removed. Save the form to confirm changes.",
        });
      } catch (error) {
        console.error('Error deleting logo:', error);
        toast({
          title: "Error",
          description: "An error occurred while removing the logo.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center border rounded-md p-6 bg-muted/50">
        {previewUrl ? (
          <div className="relative w-40 h-40 mb-4">
            <img 
              src={previewUrl} 
              alt="Company logo" 
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-40 h-40 flex items-center justify-center bg-muted mb-4 rounded-md">
            <Image className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => document.getElementById('logo-upload')?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {previewUrl ? 'Change Logo' : 'Upload Logo'}
              </>
            )}
          </Button>

          {previewUrl && (
            <Button
              variant="outline"
              onClick={handleDeleteLogo}
              disabled={isUploading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Logo
            </Button>
          )}

          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Upload a square logo image for best results. Recommended size: 400x400 pixels.
      </p>
    </div>
  );
};

export default LogoUploader;
