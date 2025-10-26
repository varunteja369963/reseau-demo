import { Lead } from '@/types/lead';

// Generate 245 demo records for CRM

const leadSources = ['Google Ads', 'Facebook', 'Website Form', 'Walk-in', 'Referral', 'Instagram', 'Dealer.com', 'AutoTrader'];
const leadChannels = ['Paid Search', 'Organic', 'Direct', 'Social', 'Email'];
const leadStatuses = ['New', 'Contacted', 'Qualified', 'Test Drive Scheduled', 'Negotiation', 'Financing', 'Sold', 'Lost'];
const salespeople = ['Sarah Chen', 'Mike Johnson', 'Emma Davis', 'James Wilson', 'Lisa Anderson', 'Tom Brown'];
const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'BMW', 'Mercedes-Benz'];
const cities = ['Kelowna', 'Penticton', 'Vernon', 'Kamloops', 'West Kelowna'];
const provinces = ['BC', 'AB', 'SK', 'MB'];
const dealerships = ['Reseau Chev Kelowna', 'Reseau Kia Penticton', 'Reseau Honda Vernon'];

const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Chris', 'Amanda', 'Daniel', 'Jennifer', 'Matthew', 'Ashley', 'Andrew', 'Melissa', 'Ryan', 'Nicole', 'Brandon', 'Lauren', 'Tyler', 'Stephanie'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee'];

const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomNum = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generatePhoneNumber = (): string => {
  const area = randomNum(200, 999);
  const prefix = randomNum(200, 999);
  const line = randomNum(1000, 9999);
  return `(${area}) ${prefix}-${line}`;
};

const generateEmail = (firstName: string, lastName: string): string => {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'hotmail.com'];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum(1, 99)}@${random(domains)}`;
};

const generateLeadScore = (): number => {
  const scores = [0, 1, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  return random(scores);
};

export const generateDemoLeads = (): Lead[] => {
  const leads: Lead[] = [];
  const startDate = new Date(2024, 0, 1);
  const endDate = new Date(2025, 9, 25);

  for (let i = 1; i <= 245; i++) {
    const firstName = random(firstNames);
    const lastName = random(lastNames);
    const fullName = `${firstName} ${lastName}`;
    const email = generateEmail(firstName, lastName);
    const leadStatus = random(leadStatuses);
    const make = random(makes);
    
    const lead: Lead = {
      // Lead Information
      leadId: `LEAD-${String(i).padStart(5, '0')}`,
      leadSource: random(leadSources),
      leadChannel: random(leadChannels),
      campaignName: `${random(['Q1', 'Q2', 'Q3', 'Q4'])} ${random(['Spring', 'Summer', 'Fall', 'Winter'])} Campaign`,
      dateOfInquiry: randomDate(startDate, endDate),
      leadStatus: leadStatus,
      assignedSalesperson: random(salespeople),
      leadOwner: random(dealerships),
      leadNotes: leadStatus === 'Lost' ? 'Price too high' : leadStatus === 'Sold' ? 'Deal closed successfully' : 'Follow up scheduled',
      
      // Customer Information
      customerId: `CUST-${String(i).padStart(5, '0')}`,
      fullName: fullName,
      email: email,
      phoneNumber: generatePhoneNumber(),
      address: `${randomNum(100, 9999)} ${random(['Main', 'Oak', 'Maple', 'Cedar', 'Pine'])} St`,
      city: random(cities),
      province: random(provinces),
      postalCode: `V${randomNum(1, 9)}${String.fromCharCode(65 + randomNum(0, 25))} ${randomNum(1, 9)}${String.fromCharCode(65 + randomNum(0, 25))}${randomNum(1, 9)}`,
      preferredContactMethod: random(['Email', 'Phone', 'SMS', 'WhatsApp']),
      customerType: random(['Individual', 'Business']),
      communicationConsent: Math.random() > 0.1,
      tags: Math.random() > 0.5 ? [random(['Hot Lead', 'VIP', 'Repeat Buyer', 'First Time Buyer'])] : [],
      
      // Vehicle Interest
      vehicleMake: make,
      model: make === 'Toyota' ? random(['Camry', 'RAV4', 'Highlander', 'Corolla']) :
             make === 'Honda' ? random(['Civic', 'Accord', 'CR-V', 'Pilot']) :
             make === 'Chevrolet' ? random(['Silverado', 'Equinox', 'Malibu', 'Blazer']) :
             random(['Sedan', 'SUV', 'Truck', 'Coupe']),
      vehicleModel: make === 'Toyota' ? random(['Camry', 'RAV4', 'Highlander', 'Corolla']) :
             make === 'Honda' ? random(['Civic', 'Accord', 'CR-V', 'Pilot']) :
             make === 'Chevrolet' ? random(['Silverado', 'Equinox', 'Malibu', 'Blazer']) :
             random(['Sedan', 'SUV', 'Truck', 'Coupe']),
      year: randomNum(2020, 2025),
      trim: random(['Base', 'SE', 'Limited', 'Premium', 'Sport']),
      colorPreference: random(['Black', 'White', 'Silver', 'Blue', 'Red', 'Gray']),
      newUsed: random(['New', 'Used']),
      vin: leadStatus === 'Sold' ? `1HGBH${randomNum(10, 99)}88X${String.fromCharCode(65 + randomNum(0, 25))}${randomNum(100000, 999999)}` : null,
      stockNumber: leadStatus === 'Sold' ? `STK-${randomNum(1000, 9999)}` : null,
      budgetRange: `$${randomNum(20, 80)}k - $${randomNum(30, 90)}k`,
      tradeIn: Math.random() > 0.5,
      tradeInDetails: Math.random() > 0.5 ? `${randomNum(2015, 2022)} ${random(makes)} ${random(['Sedan', 'SUV'])}` : null,
      
      // Deal & Sales Pipeline
      dealStage: leadStatus === 'New' ? 'Inquiry' :
                 leadStatus === 'Contacted' ? 'Contacted' :
                 leadStatus === 'Qualified' ? 'Qualified' :
                 leadStatus === 'Negotiation' ? 'Negotiation' :
                 leadStatus === 'Financing' ? 'Financing' :
                 leadStatus === 'Sold' ? 'Sold' : 'Lost',
      dealValue: leadStatus === 'Sold' ? randomNum(25000, 85000) : null,
      paymentType: leadStatus === 'Sold' ? random(['Cash', 'Financing', 'Lease']) : null,
      depositAmount: ['Test Drive Scheduled', 'Negotiation', 'Financing', 'Sold'].includes(leadStatus) ? randomNum(500, 5000) : null,
      financingInstitution: leadStatus === 'Sold' ? random(['TD Bank', 'RBC', 'BMO', 'Scotiabank', 'CIBC']) : null,
      closeProbability: leadStatus === 'Sold' ? 100 :
                       leadStatus === 'Lost' ? 0 :
                       leadStatus === 'Financing' ? randomNum(70, 95) :
                       leadStatus === 'Negotiation' ? randomNum(50, 80) :
                       randomNum(10, 60),
      expectedCloseDate: leadStatus === 'Sold' ? randomDate(startDate, endDate) : 
                        leadStatus !== 'Lost' ? randomDate(new Date(), new Date(2025, 11, 31)) : null,
      dealStatus: leadStatus === 'Sold' ? 'Won' : leadStatus === 'Lost' ? 'Lost' : 'Open',
      lostReason: leadStatus === 'Lost' ? random(['Price', 'Inventory', 'Timing', 'Competitor']) : null,
      
      // Marketing & Attribution
      utmSource: random(['google', 'facebook', 'instagram', 'direct']),
      utmMedium: random(['cpc', 'social', 'organic', 'email']),
      landingPageUrl: `/inventory/${random(['new', 'used'])}/${make.toLowerCase()}`,
      conversionEvent: random(['Form Fill', 'Phone Call', 'Live Chat']),
      timeToFirstContact: randomNum(5, 480),
      responseTime: randomNum(5, 120),
      leadScoring: generateLeadScore(),
      
      // Operational Metadata
      recordCreatedBy: random(salespeople),
      recordCreatedDate: randomDate(startDate, endDate),
      lastModifiedBy: random(salespeople),
      lastModifiedDate: randomDate(startDate, endDate),
      dataSource: random(['Manual', 'API', 'Form', 'Import']),
      crmSyncStatus: Math.random() > 0.05 ? 'Success' : 'Error',
      duplicateFlag: Math.random() > 0.95,
      
      // UI helpers
      initials: `${firstName[0]}${lastName[0]}`,
      color: leadStatus === 'Qualified' || leadStatus === 'Sold' ? 'bg-[hsl(var(--teal))]' :
             leadStatus === 'Lost' ? 'bg-gradient-to-br from-red-300 to-red-400' :
             leadStatus === 'New' ? 'bg-[hsl(var(--blue))]' :
             'bg-[hsl(var(--purple))]',
      avatarColor: leadStatus === 'Qualified' || leadStatus === 'Sold' ? 'bg-[hsl(var(--teal))]' :
             leadStatus === 'Lost' ? 'bg-gradient-to-br from-red-300 to-red-400' :
             leadStatus === 'New' ? 'bg-[hsl(var(--blue))]' :
             'bg-[hsl(var(--purple))]'
    };
    
    leads.push(lead);
  }
  
  return leads;
};
