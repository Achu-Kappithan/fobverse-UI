import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoggerService } from '../../../../../shared/services/logger/logger.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CompanyService } from '../../../services/company-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../../shared/services/toast/toast.service';

@Component({
  selector: 'app-add-internal-user.component',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-internal-user.component.html',
  styleUrl: './add-internal-user.component.css',
})
export class AddInternalUserComponent implements OnInit {
createUserForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  private readonly _logger = inject(LoggerService);

  constructor(
    private readonly _companyService: CompanyService,
    private readonly _router :Router,
    private readonly _route: ActivatedRoute,
    private readonly _toast: ToastService
  ) {}

  ngOnInit(): void {
    this.createUserForm = new FormGroup(
      {
        role: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required,Validators.pattern(/^(?!\d+$)(?![^a-zA-Z]+$)[a-zA-Z\s]+$/),Validators.maxLength(25)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  };

  getControl(name: string): AbstractControl | null {
    return this.createUserForm.get(name);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }
    const data = { ...this.createUserForm.value };
    delete data.confirmPassword;
    this._logger.log("Form submitted data", data);
    this._companyService.createUser(data).subscribe({
      next:(res =>{
        if(res.success){
          this._logger.log("User created successfully", res.data);
          this._toast.success(res.message!)
          this.createUserForm.reset()
          this._router.navigate(['../'], { relativeTo: this._route });       
        }
      }),
      error: (err =>{
        this._toast.error(err.error.message)
        this._logger.error("error while updating the user",err)
      })
    })

  }
}
