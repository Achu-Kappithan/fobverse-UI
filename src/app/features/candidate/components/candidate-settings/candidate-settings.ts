import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CandidateService } from '../../services/candidate.service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { PasswordValidator } from '../../../../shared/directives/passwordvalidators/passwordvalidator';

@Component({
  selector: 'app-candidate-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, PasswordValidator],
  templateUrl: './candidate-settings.html',
  styleUrl: './candidate-settings.css'
})
export class CandidateSettingsComponent implements OnInit {
  passwordChangeForm!: FormGroup;
  isLoading = false;
  private loadingToastId: number | null = null;
  private readonly _logger = inject(LoggerService);

  constructor(
    private fb: FormBuilder,
    private readonly _candidateService: CandidateService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _toast: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.passwordChangeForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;

    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
      form.get('confirmNewPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      form.get('confirmNewPassword')?.setErrors(null);
      return null;
    }
  }

  updatePassword(): void {
    if (this.passwordChangeForm.invalid) {
      this.passwordChangeForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loadingToastId = this._toast.loading('Updating password...');

    const { currentPassword, newPassword } = this.passwordChangeForm.value;
    this._candidateService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        if (this.loadingToastId !== null) this._toast.remove(this.loadingToastId);
        this._toast.success('Password changed successfully.');
        this.isLoading = false;
        this.passwordChangeForm.reset();
        this._cdr.detectChanges();
      },
      error: (err) => {
        this._logger.error("Error changing password:", err);
        if (this.loadingToastId !== null) this._toast.remove(this.loadingToastId);
        this._toast.error(err.error?.message || 'Failed to change password. Please check your current password.');
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    });
  }
}
