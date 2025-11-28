export interface Employee {
  employeeID : number;
  lastName: string | null;
  firstName: string | null;
  title: string | null;
  titleOfCourtesy: string | null;
  birthDate: string;
  hireDate: string;
  address: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;
  homePhone: string | null;
  extension: string | null;
  notes: string | null;
  reportsTo: number | null;
  photoPath: string | null;
}