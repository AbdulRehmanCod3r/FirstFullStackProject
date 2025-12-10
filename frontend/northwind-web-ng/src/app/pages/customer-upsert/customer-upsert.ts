import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService, CustomerListItem } from '../../services/customer.service';

@Component({
  selector: 'app-customer-upsert',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-upsert.html',
  styleUrl: './customer-upsert.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerUpsert implements OnInit {
  form!: FormGroup;
  isEditMode = signal<boolean>(false);
  customerId = signal<string | null>(null);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  error = signal<string>('');
  successMessage = signal<string>('');

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode.set(true);
        this.customerId.set(params['id']);
        this.loadCustomer(params['id']);
      }
    });
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      customerID: [
        { value: '', disabled: false },
        [Validators.required, Validators.minLength(3), Validators.maxLength(5)]
      ],
      contactName: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(100)]
      ],
      companyName: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(100)]
      ],
      contactTitle: ['', [Validators.maxLength(50)]],
      address: ['', [Validators.maxLength(200)]],
      city: ['', [Validators.maxLength(50)]],
      region: ['', [Validators.maxLength(50)]],
      postalCode: ['', [Validators.maxLength(20)]],
      country: ['', [Validators.maxLength(50)]],
      phone: ['', [Validators.maxLength(20)]],
      fax: ['', [Validators.maxLength(20)]]
    });
  }

  private loadCustomer(id: string): void {
    this.loading.set(true);
    this.customerService.getCustomerById(id).subscribe({
      next: (customer) => {
        this.form.patchValue(customer);
        // Disable customerID in edit mode
        this.form.get('customerID')?.disable();
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load customer details.');
        this.loading.set(false);
        console.error('Error loading customer:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.error.set('Please fill in all required fields correctly.');
      this.markFormGroupTouched(this.form);
      return;
    }

    this.submitting.set(true);
    this.error.set('');
    this.successMessage.set('');

    const formValue = this.form.getRawValue(); // getRawValue includes disabled fields

    if (this.isEditMode() && this.customerId()) {
      // Update customer
      this.customerService.updateCustomer(this.customerId()!, formValue).subscribe({
        next: (response) => {
          this.successMessage.set('Customer updated successfully!');
          this.submitting.set(false);
          setTimeout(() => {
            this.router.navigate(['/customers']);
          }, 1500);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Failed to update customer.');
          this.submitting.set(false);
          console.error('Error updating customer:', err);
        }
      });
    } else {
      // Create new customer
      this.customerService.createCustomer(formValue).subscribe({
        next: (response) => {
          this.successMessage.set('Customer created successfully!');
          this.submitting.set(false);
          setTimeout(() => {
            this.router.navigate(['/customers']);
          }, 1500);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Failed to create customer.');
          this.submitting.set(false);
          console.error('Error creating customer:', err);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/customers']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.hasError(errorType) && field.touched);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.hasError('required')) {
      return `${this.formatLabel(fieldName)} is required.`;
    }
    if (field.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `${this.formatLabel(fieldName)} must be at least ${minLength} characters.`;
    }
    if (field.hasError('maxlength')) {
      const maxLength = field.getError('maxlength').requiredLength;
      return `${this.formatLabel(fieldName)} cannot exceed ${maxLength} characters.`;
    }
    return 'Invalid input';
  }

  private formatLabel(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}
