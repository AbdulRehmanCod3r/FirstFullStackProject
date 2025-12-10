import { Component, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService, CustomerListItem } from '../../services/customer.service';

@Component({
  selector: 'app-customer-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerList implements OnInit {
  customers = signal<CustomerListItem[]>([]);
  loading = signal<boolean>(false);
  error = signal<string>('');
  searchTerm = signal<string>('');
  filteredCustomers = computed(() => {
    const term = this.searchTerm()?.toLowerCase() || '';
    const allCustomers = this.customers();
    if (!term) {
      return allCustomers;
    }
    return allCustomers.filter(c =>
      c.customerID.toLowerCase().includes(term) ||
      c.contactName.toLowerCase().includes(term) ||
      c.companyName.toLowerCase().includes(term) ||
      c.city.toLowerCase().includes(term)
    );
  });

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading.set(true);
    this.error.set('');
    this.customerService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load customers. Please try again later.');
        this.loading.set(false);
        console.error('Error loading customers:', err);
      }
    });
  }

  addCustomer(): void {
    this.router.navigate(['/customers/add']);
  }

  editCustomer(customerId: string): void {
    this.router.navigate(['/customers/edit', customerId]);
  }

  viewCustomer(customerId: string): void {
    this.router.navigate(['/customers', customerId]);
  }

  deleteCustomer(customerId: string): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(customerId).subscribe({
        next: () => {
          const updated = this.customers().filter(c => c.customerID !== customerId);
          this.customers.set(updated);
          alert('Customer deleted successfully.');
        },
        error: (err) => {
          alert('Failed to delete customer. ' + (err.error?.message || ''));
          console.error('Error deleting customer:', err);
        }
      });
    }
  }
}
