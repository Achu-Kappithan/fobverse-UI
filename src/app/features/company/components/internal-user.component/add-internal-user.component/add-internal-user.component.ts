import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { SweetAlert } from '../../../../../shared/services/sweet-alert';

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

  constructor(
    private readonly _companyService: CompanyService,
    private readonly _router :Router,
    private readonly _route: ActivatedRoute,
    private readonly _swal: SweetAlert
  ) {}

  ngOnInit(): void {
    this.createUserForm = new FormGroup(
      {
        role: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
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
    const {confirmPassword,...data }= this.createUserForm.value
    console.log("form subminted data",data)
    this._companyService.createUser(data).subscribe({
      next:(res =>{
        if(res.success){
          console.log("updated responce",res.data)
          this._swal.showSuccessToast(res.message)
          this.createUserForm.reset()
          this._router.navigate(['../'], { relativeTo: this._route });        }
      }),
      error: (err =>{
        this._swal.showErrorToast(err.error.message)
        console.log("error while updating the user",err)
      })
    })

  }
}
