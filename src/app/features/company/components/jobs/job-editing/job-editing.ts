import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CompanyService } from '../../../services/company-service';
import { SweetAlert } from '../../../../../shared/services/sweet-alert';
import { JobsInterface } from '../../../interfaces/company.responce.interface';

@Component({
  selector: 'app-job-editing',
  imports: [RouterModule,CommonModule,ReactiveFormsModule],
  templateUrl: './job-editing.html',
  styleUrl: './job-editing.css'
})
export class JobEditing implements OnInit {

  jobId: string | null = null;
  jobDetails: JobsInterface | null = null;
  jobEditForm!: FormGroup;

  minDate: string = '';
  locationPattern = /^[A-Za-z\s]+$/;

  constructor(
    private fb: FormBuilder,
    private readonly _companyService: CompanyService,
    private readonly _swal: SweetAlert,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute
  ) {
    const day = new Date();
    day.setDate(day.getDate() + 1);
    this.minDate = (day.toISOString().split('T')[0]);
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
    'Java'
  ];

  ngOnInit(): void {
    this.initForm();

    this._route.queryParams.subscribe(val => {
      this.jobId = val['id'];
      if (this.jobId) {
        this.getJobDetails();
      }
    });
  }

  getJobDetails() {
    if (this.jobId) {
      this._companyService.getJobDetails(this.jobId).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.jobDetails = res.data;
            this.populateForm(); 
          } else {
            this._swal.showErrorToast('Job not found');
            this._router.navigate(['./'],{relativeTo:this._route})
          }
        },
        error: (err) => {
          console.error("error getting job details for editing:", err);
          this._swal.showErrorToast(err.error.message);
          this._router.navigate(['./'],{relativeTo:this._route})
        }
      });
    }
  }

  initForm() {
    this.jobEditForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(25), Validators.pattern(/^[a-zA-Z0-9 ]*$/)]],
      description: ['', Validators.required],
      responsibility: ['', Validators.required],
      jobType: ['', Validators.required],
      vacancies: [1, [Validators.required, Validators.min(1)]],
      dueDate: ['', [Validators.required]],
      skills: this.fb.array([], [Validators.required]), 
      location: this.fb.array([], [Validators.required]), 
      experience: this.fb.array([]), 
      salary: this.fb.group({
        min: [0, [Validators.required, Validators.min(0)]],
        max: [0, [Validators.required, Validators.min(0)]]
      })
    });
  }

  populateForm() {
    if (this.jobDetails) {
      this.jobEditForm.patchValue({
        title: this.jobDetails.title,
        description: this.jobDetails.description,
        responsibility: this.jobDetails.responsibility,
        jobType: this.jobDetails.jobType,
        vacancies: this.jobDetails.vacancies,
        dueDate: this.jobDetails.dueDate ? new Date(this.jobDetails.dueDate).toISOString().split('T')[0] : ''
      });

      if (this.jobDetails.salary) {
        this.jobEditForm.get('salary')?.patchValue({
          min: this.jobDetails.salary.min,
          max: this.jobDetails.salary.max
        });
      }

      this.skills.clear();
      this.jobDetails.skills?.forEach(skill => {
        this.skills.push(this.fb.control(skill, Validators.required));
      });

      this.locations.clear();
      this.jobDetails.location?.forEach(loc => {
        this.locations.push(this.fb.control(loc, [Validators.required, Validators.pattern(this.locationPattern)]));
      });

      this.experience.clear();
      this.jobDetails.experience?.forEach(exp => {
        this.experience.push(this.fb.control(exp, Validators.required));
      });
    }
  }


  get skills(): FormArray {
    return this.jobEditForm.get('skills') as FormArray;
  }

  get locations(): FormArray {
    return this.jobEditForm.get('location') as FormArray;
  }

  get experience(): FormArray {
    return this.jobEditForm.get('experience') as FormArray;
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
    const value = (event.target as HTMLSelectElement).value;
    if (value) {
      this.skills.at(index).setValue(value);
    }
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  addLocation() {
    this.locations.push(this.fb.control('', [Validators.required, Validators.pattern(this.locationPattern)]));
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


  isNestedInvalid(groupName: string, controlName: string): boolean {
    const group = this.jobEditForm.get(groupName) as FormGroup;
    const control = group ? group.get(controlName) : null;
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  isFormArrayControlInvalid(formArray: FormArray, index: number): boolean {
    const control = formArray.at(index);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  isFormArrayInvalid(arrayName: string): boolean {
    const formArray = this.jobEditForm.get(arrayName) as FormArray;
    return formArray ? formArray.invalid && (formArray.dirty || formArray.touched) : false;
  }

  updateChanges() {
    console.log("works")
    if (this.jobEditForm.valid) {
      console.log("form valid  redy to update")
      const formData = this.jobEditForm.value;
      this._companyService.updateJobDetails(this.jobId!,formData)
      .subscribe({
        next:(res =>{
          if(res.success){
            this.jobDetails = res.data
            this._swal.showSuccessToast(res.message)
            this._router.navigate(['../'],{relativeTo:this._route})
          }
        }),
        error:(err =>{
          console.log("error for updating jobDetails",err)
          this._swal.showErrorToast(err.error.message)
        })
      })
    } else {
      this.jobEditForm.markAllAsTouched(); 
      this._swal.showErrorToast('Validation Error', 'Please fill out all required fields and correct any errors.');
      console.log('Form is invalid:', this.jobEditForm.value);
    }
  }



}
