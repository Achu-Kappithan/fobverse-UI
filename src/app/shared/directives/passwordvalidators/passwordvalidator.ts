import { Directive, inject, Input } from '@angular/core';
import { LoggerService } from '../../services/logger/logger.service';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appPasswordvalidator]',
  standalone: true,
  providers:[{
    provide:NG_VALIDATORS,
    useExisting:Passwordvalidator,
    multi: true
  }]
})
export class Passwordvalidator implements Validator {
  @Input() requireUppercase: boolean = true
  @Input() requireLowercase: boolean = true
  @Input() requireDigit: boolean = true
  @Input() requireSpecialChar: boolean = true
  @Input() minLength: number = 8

  private readonly _logger = inject(LoggerService);
validate(control: AbstractControl): ValidationErrors | null {
  this._logger.log("Password validation triggered");
    const value = control.value;

    if (!value) {
      return null; 
    }

    const errors: ValidationErrors = {};

    if (value.length < this.minLength) {
      errors['minLength'] = {
        requiredLength: this.minLength,
        actualLength: value.length,
        message: `Password must be at least ${this.minLength} characters long.`
      };
    }

    if (this.requireUppercase && !/[A-Z]/.test(value)) {
      errors['requireUppercase'] = {
        message: 'Password must contain at least one uppercase letter.'
      };
    }

    if (this.requireLowercase && !/[a-z]/.test(value)) {
      errors['requireLowercase'] = {
        message: 'Password must contain at least one lowercase letter.'
      };
    }

    if (this.requireDigit && !/\d/.test(value)) {
      errors['requireDigit'] = {
        message: 'Password must contain at least one digit.'
      };
    }

    if (this.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(value)) {
      errors['requireSpecialChar'] = {
        message: 'Password must contain at least one special character.'
      };
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }
}
