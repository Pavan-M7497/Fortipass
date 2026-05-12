export type SubscriptionPlan = 'free' | 'premium' | 'business';
export type AppMode = 'personal' | 'business';
export type OrgRole = 'owner' | 'admin' | 'employee';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  mode: AppMode;
  subscriptionPlan: SubscriptionPlan;
  securityScore: number;
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
}

export interface VaultItem {
  id: string;
  ownerId: string;
  encryptedData: string; // The AES-256 encrypted string containing username, password, url, notes, etc.
  iv: string; // Base64 encoded IV for decryption
  category: string;
  tags: string[];
  favorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface DocumentItem {
  id: string;
  ownerId: string;
  encryptedFileUrl: string; // URL to the encrypted file in Firebase Storage
  fileName: string;
  iv: string; // Base64 encoded IV
  category: string;
  fileType: string;
  fileSize: number;
  uploadedAt: number;
}

export interface Organization {
  id: string;
  organizationName: string;
  ownerId: string;
  members: string[]; // Array of User IDs
  subscriptionPlan: SubscriptionPlan;
  createdAt: number;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: OrgRole;
  joinedAt: number;
}

export interface BreachAlert {
  id: string;
  userId: string;
  affectedWebsite: string;
  severity: SeverityLevel;
  breachDate: number;
  resolved: boolean;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  action: string;
  performedBy: string; // User ID
  timestamp: number;
}

export interface Subscription {
  id: string;
  userId: string;
  currentPlan: SubscriptionPlan;
  billingCycle: 'monthly' | 'yearly';
  paymentProvider: string;
  status: 'active' | 'past_due' | 'canceled';
  renewalDate: number;
}

export interface PasswordHealth {
  id: string;
  userId: string;
  weakPasswords: number;
  reusedPasswords: number;
  compromisedPasswords: number;
  passwordsWithout2FA: number;
}

export interface UserSettings {
  id: string;
  userId: string;
  darkMode: boolean;
  autofillEnabled: boolean;
  breachAlertsEnabled: boolean;
  notificationPreferences: Record<string, boolean>;
}
