import { Company, Category } from '../types/database';
import { 
  DatabaseOperations, 
  LogoStorage, 
  DatabaseConfig, 
  DatabaseInitOptions, 
  DatabaseStatus 
} from '../types/database.schema';
import { v4 as uuidv4 } from 'uuid';

// Default database configuration
const defaultConfig: DatabaseConfig = {
  storageType: 'localStorage',
  logoStoragePath: '/logos',
  enableBackup: true,
  backupInterval: 3600000 // 1 hour
};

/**
 * CompanyDatabase class implements the DatabaseOperations interface
 * and provides methods for managing company data
 */
export class CompanyDatabase implements DatabaseOperations {
  private companies: Company[] = [];
  private logos: Map<string, LogoStorage> = new Map();
  private config: DatabaseConfig;
  private status: DatabaseStatus = {
    isConnected: false,
    lastSync: null,
    itemCount: 0,
    storageUsed: 0,
    error: null
  };

  constructor(options?: DatabaseInitOptions) {
    this.config = options?.config || defaultConfig;
    
    // Initialize with data if provided
    if (options?.initialData) {
      this.companies = [...options.initialData];
    }
    
    // Set up error handler
    const errorHandler = options?.onError || console.error;
    
    try {
      this.initDatabase();
    } catch (error) {
      this.status.error = error.message;
      errorHandler(error);
    }
  }

  /**
   * Initialize the database based on the storage type
   */
  private async initDatabase(): Promise<void> {
    switch (this.config.storageType) {
      case 'localStorage':
        await this.initLocalStorage();
        break;
      case 'indexedDB':
        await this.initIndexedDB();
        break;
      case 'firebase':
        await this.initFirebase();
        break;
      case 'custom':
        // Custom initialization would be implemented here
        break;
      default:
        await this.initLocalStorage();
    }
    
    // Set up backup if enabled
    if (this.config.enableBackup && this.config.backupInterval) {
      setInterval(() => this.backup(), this.config.backupInterval);
    }
    
    this.status.isConnected = true;
    this.status.itemCount = this.companies.length;
    this.updateStorageUsed();
  }

  /**
   * Initialize localStorage as the database
   */
  private async initLocalStorage(): Promise<void> {
    try {
      // Load companies
      const storedCompanies = localStorage.getItem('companies');
      if (storedCompanies) {
        const parsedCompanies = JSON.parse(storedCompanies);
        // Convert string dates back to Date objects
        this.companies = parsedCompanies.map((company: any) => ({
          ...company,
          lastUpdated: new Date(company.lastUpdated)
        }));
      }
      
      // Load logos
      const storedLogos = localStorage.getItem('logos');
      if (storedLogos) {
        const parsedLogos = JSON.parse(storedLogos);
        parsedLogos.forEach((logo: LogoStorage) => {
          this.logos.set(logo.id, {
            ...logo,
            uploadDate: new Date(logo.uploadDate)
          });
        });
      }
      
      this.status.lastSync = new Date();
    } catch (error) {
      this.status.error = `LocalStorage initialization error: ${error.message}`;
      throw error;
    }
  }

  /**
   * Initialize IndexedDB as the database
   */
  private async initIndexedDB(): Promise<void> {
    // IndexedDB implementation would go here
    // This is a placeholder for future implementation
    this.status.error = 'IndexedDB not yet implemented';
    throw new Error('IndexedDB not yet implemented');
  }

  /**
   * Initialize Firebase as the database
   */
  private async initFirebase(): Promise<void> {
    // Firebase implementation would go here
    // This is a placeholder for future implementation
    this.status.error = 'Firebase not yet implemented';
    throw new Error('Firebase not yet implemented');
  }

  /**
   * Save the current state to the storage
   */
  private async saveToStorage(): Promise<void> {
    if (this.config.storageType === 'localStorage') {
      localStorage.setItem('companies', JSON.stringify(this.companies));
      localStorage.setItem('logos', JSON.stringify(Array.from(this.logos.values())));
      this.status.lastSync = new Date();
      this.updateStorageUsed();
    }
    // Other storage types would have their own implementation
  }

  /**
   * Create a backup of the current data
   */
  private async backup(): Promise<void> {
    try {
      const backup = {
        companies: this.companies,
        logos: Array.from(this.logos.values()),
        timestamp: new Date()
      };
      
      localStorage.setItem('database_backup', JSON.stringify(backup));
    } catch (error) {
      console.error('Backup failed:', error);
    }
  }

  /**
   * Update the storage used metric
   */
  private updateStorageUsed(): void {
    try {
      const companiesSize = new Blob([JSON.stringify(this.companies)]).size;
      const logosSize = new Blob([JSON.stringify(Array.from(this.logos.values()))]).size;
      this.status.storageUsed = companiesSize + logosSize;
    } catch (error) {
      console.error('Error calculating storage size:', error);
    }
  }

  /**
   * Get the current database status
   */
  public getStatus(): DatabaseStatus {
    return { ...this.status };
  }

  // Company operations implementation

  /**
   * Get all companies
   */
  public async getAllCompanies(): Promise<Company[]> {
    return [...this.companies];
  }

  /**
   * Get companies by category
   */
  public async getCompaniesByCategory(category: Category): Promise<Company[]> {
    return this.companies.filter(company => company.category === category);
  }

  /**
   * Get a company by ID
   */
  public async getCompanyById(id: string): Promise<Company | null> {
    const company = this.companies.find(company => company.id === id);
    return company || null;
  }

  /**
   * Add a new company
   */
  public async addCompany(company: Company): Promise<Company> {
    // Ensure the company has an ID and lastUpdated date
    const newCompany: Company = {
      ...company,
      id: company.id || uuidv4(),
      lastUpdated: new Date()
    };
    
    this.companies.push(newCompany);
    await this.saveToStorage();
    this.status.itemCount = this.companies.length;
    
    return newCompany;
  }

  /**
   * Update an existing company
   */
  public async updateCompany(id: string, updates: Partial<Company>): Promise<Company | null> {
    const index = this.companies.findIndex(company => company.id === id);
    
    if (index === -1) {
      return null;
    }
    
    // Create updated company with new lastUpdated date
    const updatedCompany: Company = {
      ...this.companies[index],
      ...updates,
      id, // Ensure ID doesn't change
      lastUpdated: new Date()
    };
    
    this.companies[index] = updatedCompany;
    await this.saveToStorage();
    
    return updatedCompany;
  }

  /**
   * Delete a company
   */
  public async deleteCompany(id: string): Promise<boolean> {
    const initialLength = this.companies.length;
    this.companies = this.companies.filter(company => company.id !== id);
    
    // Also delete the logo if it exists
    this.logos.delete(id);
    
    await this.saveToStorage();
    this.status.itemCount = this.companies.length;
    
    return initialLength > this.companies.length;
  }

  /**
   * Get highlighted companies
   */
  public async getHighlightedCompanies(): Promise<Company[]> {
    return this.companies.filter(company => company.details.highlighted);
  }

  /**
   * Search companies by name or description
   */
  public async searchCompanies(query: string): Promise<Company[]> {
    const lowerQuery = query.toLowerCase();
    return this.companies.filter(company => 
      company.name.toLowerCase().includes(lowerQuery) ||
      company.description.toLowerCase().includes(lowerQuery)
    );
  }

  // Logo operations implementation

  /**
   * Upload a logo for a company
   */
  public async uploadLogo(id: string, file: File, altText: string): Promise<LogoStorage> {
    // In a real implementation, this would handle file upload to a server or storage service
    // For now, we'll simulate it by storing the file information
    
    const filename = `${id}_${file.name}`;
    const path = `${this.config.logoStoragePath}/${filename}`;
    
    const logoStorage: LogoStorage = {
      id,
      filename,
      uploadDate: new Date(),
      path,
      altText
    };
    
    this.logos.set(id, logoStorage);
    
    // Update the company's logo path
    const company = await this.getCompanyById(id);
    if (company) {
      await this.updateCompany(id, { logo: path });
    }
    
    await this.saveToStorage();
    
    return logoStorage;
  }

  /**
   * Get logo information for a company
   */
  public async getLogo(id: string): Promise<LogoStorage | null> {
    const logo = this.logos.get(id);
    return logo || null;
  }

  /**
   * Update a company's logo
   */
  public async updateLogo(id: string, file: File, altText: string): Promise<LogoStorage | null> {
    // Check if the company exists
    const company = await this.getCompanyById(id);
    if (!company) {
      return null;
    }
    
    return this.uploadLogo(id, file, altText);
  }

  /**
   * Delete a company's logo
   */
  public async deleteLogo(id: string): Promise<boolean> {
    const deleted = this.logos.delete(id);
    
    if (deleted) {
      // Update the company to remove the logo path
      const company = await this.getCompanyById(id);
      if (company) {
        await this.updateCompany(id, { logo: '' });
      }
      
      await this.saveToStorage();
    }
    
    return deleted;
  }
}

// Create and export a singleton instance
export const companyDatabase = new CompanyDatabase({
  config: defaultConfig
});

// Export a hook for using the database
export const useCompanyDatabase = () => {
  return companyDatabase;
};
