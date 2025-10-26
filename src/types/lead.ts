export interface Lead {
  // Lead Information
  leadId: string;
  leadSource: string;
  leadChannel: string;
  campaignName: string;
  dateOfInquiry: Date;
  leadStatus: string;
  assignedSalesperson: string;
  leadOwner: string;
  leadNotes: string;
  dealership: string;
  
  // Customer Information
  customerId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  preferredContactMethod: string;
  customerType: string;
  communicationConsent: boolean;
  tags?: string[];
  
  // Vehicle Interest
  vehicleMake: string;
  model: string;
  vehicleModel?: string;
  year: number;
  trim: string;
  colorPreference: string;
  newUsed: string;
  vin: string | null;
  stockNumber: string | null;
  budgetRange: string;
  tradeIn: boolean;
  tradeInDetails: string | null;
  
  // Deal & Sales Pipeline
  dealStage: string;
  dealValue: number | null;
  paymentType: string | null;
  depositAmount: number | null;
  financingInstitution: string | null;
  closeProbability: number;
  expectedCloseDate: Date | null;
  dealStatus: string;
  lostReason: string | null;
  
  // Marketing & Attribution
  utmSource: string;
  utmMedium: string;
  landingPageUrl: string;
  conversionEvent: string;
  timeToFirstContact: number;
  responseTime: number;
  leadScoring: number;
  
  // Operational Metadata
  recordCreatedBy: string;
  recordCreatedDate: Date;
  lastModifiedBy: string;
  lastModifiedDate: Date;
  dataSource: string;
  crmSyncStatus: string;
  duplicateFlag: boolean;
  
  // UI helpers
  initials: string;
  color: string;
  avatarColor?: string;
}
