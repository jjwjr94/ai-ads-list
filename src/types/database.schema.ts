// Database schema for AI marketing companies
// This schema defines the structure for the centralized database

import { Company, Category } from './database';

// Schema for company logo storage
export interface LogoStorage {
  id: string;              // Unique identifier (matches company id)
  filename: string;        // Filename with extension
  originalUrl?: string;    // Original URL where logo was sourced (e.g., LinkedIn)
  uploadDate: Date;        // When the logo was uploaded
  path: string;            // Path to the stored logo file
  altText: string;         // Alternative text for accessibility
}

// Schema for database operations
export interface DatabaseOperations {
  // Company operations
  getAllCompanies: () => Promise<Company[]>;
  getCompaniesByCategory: (category: Category) => Promise<Company[]>;
  getCompanyById: (id: string) => Promise<Company | null>;
  addCompany: (company: Company) => Promise<Company>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<Company | null>;
  deleteCompany: (id: string) => Promise<boolean>;
  getHighlightedCompanies: () => Promise<Company[]>;
  searchCompanies: (query: string) => Promise<Company[]>;
  
  // Logo operations
  uploadLogo: (id: string, file: File, altText: string) => Promise<LogoStorage>;
  getLogo: (id: string) => Promise<LogoStorage | null>;
  updateLogo: (id: string, file: File, altText: string) => Promise<LogoStorage | null>;
  deleteLogo: (id: string) => Promise<boolean>;
}

// Database configuration
export interface DatabaseConfig {
  storageType: 'localStorage' | 'indexedDB' | 'firebase' | 'custom';
  logoStoragePath: string;
  enableBackup: boolean;
  backupInterval?: number; // in milliseconds
}

// Database initialization options
export interface DatabaseInitOptions {
  config: DatabaseConfig;
  initialData?: Company[];
  onError?: (error: Error) => void;
}

// Database status
export interface DatabaseStatus {
  isConnected: boolean;
  lastSync: Date | null;
  itemCount: number;
  storageUsed: number; // in bytes
  error: string | null;
}
