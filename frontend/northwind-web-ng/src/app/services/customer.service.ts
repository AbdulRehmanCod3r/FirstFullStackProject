import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CustomerListItem {
  customerID: string;
  contactName: string;
  companyName: string;
  contactTitle: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string;
  fax: string;
}

export interface CreateCustomerDto {
  customerID: string;
  contactName: string;
  companyName: string;
  contactTitle?: string;
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  fax?: string;
}

export interface UpdateCustomerDto {
  contactName: string;
  companyName: string;
  contactTitle?: string;
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  fax?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'https://localhost:7035/customers';

  constructor(private http: HttpClient) { }

  getAllCustomers(): Observable<CustomerListItem[]> {
    return this.http.get<CustomerListItem[]>(this.apiUrl);
  }

  getCustomerById(id: string): Observable<CustomerListItem> {
    return this.http.get<CustomerListItem>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customer: CreateCustomerDto): Observable<any> {
    return this.http.post(this.apiUrl, customer);
  }

  updateCustomer(id: string, customer: UpdateCustomerDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

