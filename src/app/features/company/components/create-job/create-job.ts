import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CompanyService } from '../../services/company-service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { JobsInterface } from '../../interfaces/company.response.interface';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Subject,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-create-job',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './create-job.html',
  styleUrl: './create-job.css',
})
export class CreateJobComponent implements OnInit {

  creatJob!: FormGroup;
  minDate = '';
  locationPattern = /^[A-Za-z\s]+$/;
  isSaving = false;
  private readonly _logger = inject(LoggerService);

  suggestions: Record<number, string[] | undefined> = {};

  private searchSubject = new Subject<{ val: string; index: number }>();

  constructor(
    private fb: FormBuilder,
    private readonly _companyService: CompanyService,
    private readonly _toast: ToastService,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _cdr: ChangeDetectorRef
  ) {
    const day = new Date();
    day.setDate(day.getDate() + 1);
    this.minDate = day.toISOString().split('T')[0];
  }

  skillSuggestions = [
    'React',
    'Angular',
    'Vue.js',
    'Node.js',
    'TypeScript',
    'JavaScript',
    'HTML',
    'CSS',
    'Python',
    'Java',
  ];

  ngOnInit(): void {
    this.initForm();

    this.searchSubject
      .pipe(
        debounceTime(200),
        distinctUntilChanged((prev, curr) => prev.val === curr.val),
        switchMap(({ val, index }) =>
          this._companyService
            .searchLocations(val)
            .pipe(map((results) => ({ index, results })))
        )
      )
      .subscribe(({ index, results }) => {
        this._logger.log('Location search results:', results?.length);
        this.suggestions[index] = results;
        this._cdr.detectChanges()
      });
  }

  initForm() {
    this.creatJob = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(25),
          Validators.pattern(/^[a-zA-Z0-9 ]*$/),
        ],
      ],
      description: ['', Validators.required],
      responsibility: ['', Validators.required],
      jobType: ['', Validators.required],
      vacancies: [1, [Validators.required, Validators.min(1)]],
      dueDate: ['', [Validators.required]],
      skills: this.fb.array([], [Validators.required]),
      location: this.fb.array([], [Validators.required]),
      experience: this.fb.array([]),
      salary: this.fb.group({
        min: [5000, [Validators.required, Validators.min(0)]],
        max: [25000, [Validators.required, Validators.min(0)]],
      }),
    });
  }

  minArrayLength(min: number) {
    return (control: FormArray) => {
      return control.length >= min
        ? null
        : {
            minArrayLength: {
              requiredLength: min,
              actualLength: control.length,
            },
          };
    };
  }

  get skills(): FormArray {
    return this.creatJob.get('skills') as FormArray;
  }

  get locations(): FormArray {
    return this.creatJob.get('location') as FormArray;
  }

  get experience(): FormArray {
    return this.creatJob.get('experience') as FormArray;
  }

  get skillControls(): FormControl[] {
    return this.skills.controls as FormControl[];
  }

  get locationControls(): FormControl[] {
    return this.locations.controls as FormControl[];
  }

  get experienceControls(): FormControl[] {
    return this.experience.controls as FormControl[];
  }

  addSkill() {
    this.skills.push(this.fb.control('', Validators.required));
  }

  onSuggestionSelect(index: number, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value) {
      this.skills.at(index).setValue(value);
    }
  }

  removeSkill(index: number) {
    this._logger.log('Removing skill at index:', index);
    this.skills.removeAt(index);
  }

  addLocation() {
    this.locations.push(
      this.fb.control('', [
        Validators.required,
        Validators.pattern(this.locationPattern),
      ])
    );
    this.suggestions = {};
  this._cdr.detectChanges();
  }

  addExperience() {
    this.experience.push(this.fb.control('', Validators.required));
  }

  removeLocation(index: number) {
    this.locations.removeAt(index);
  }

  removeExperience(index: number) {
    this.experience.removeAt(index);
  }

  saveChanges() {
    this.creatJob.markAllAsTouched();

    this._logger.log('Form submission check', { valid: this.creatJob.valid });

    if (this.creatJob.valid) {
      this.isSaving = true;
      const data: JobsInterface = this.creatJob.value;
      this._logger.log('Form Submitted Successfully!');

      this._companyService.addJobs(data).subscribe({
        next: (res) => {
          this._logger.log('Job created successfully');
          if (res.success) {
            this._toast.success(res.message);
            this._router.navigate(['../'], { relativeTo: this._route });
          }
          this.isSaving = false;
        },
        error: (err) => {
          this._logger.error('Error creating job:', err);
          this._toast.error(err.error.message);
          this.isSaving = false;
        },
      });
    } else {
      this._logger.warn('Form is invalid. Please check the required fields.');
    }
  }

  getFormValidationErrors() {
    const formErrors: Record<string, unknown> = {};
    Object.keys(this.creatJob.controls).forEach((key) => {
      const controlErrors = this.creatJob.get(key)?.errors;
      if (controlErrors) {
        formErrors[key] = controlErrors;
      }
    });

    return formErrors;
  }

  isInvalid(controlName: string): boolean {
    const control = this.creatJob.get(controlName);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  isNestedInvalid(groupName: string, controlName: string): boolean {
    const group = this.creatJob.get(groupName) as FormGroup;
    const control = group ? group.get(controlName) : null;
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  isFormArrayControlInvalid(formArray: FormArray, index: number): boolean {
    const control = formArray.at(index);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  isFormArrayInvalid(arrayName: string): boolean {
    const formArray = this.creatJob.get(arrayName) as FormArray;
    return formArray
      ? formArray.invalid && (formArray.dirty || formArray.touched)
      : false;
  }

  setLocation(index: number, suggestion: string) {
    this.locationControls.at(index)?.setValue(suggestion);
    this.suggestions[index] = [];
  }

  getSuggestion(event: Event, index: number) {
    const val = (event.target as HTMLInputElement).value.trim();
    this._logger.log('Searching for location:', val);
    if (val.length > 1) {
      this.searchSubject.next({ val, index });
    } else {
      this.suggestions[index] = [];
    }
  }
}
