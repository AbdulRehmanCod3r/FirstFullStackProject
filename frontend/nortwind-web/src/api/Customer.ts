export interface Customer {
  customerID?: string; 
  companyName: string;
  contactName: string;
  contactTitle: string;
  address: string;
  city: string;
  region?: string | null;
  postalCode: string;
  country: string;
  phone: string;
}
