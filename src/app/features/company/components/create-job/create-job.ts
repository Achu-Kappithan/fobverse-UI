import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CompanyService } from '../../services/company-service';
import { SweetAlert } from '../../../../shared/services/sweet-alert';
import { JobsInterface } from '../../interfaces/company.responce.interface';

@Component({
  selector: 'app-create-job',
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './create-job.html',
  styleUrl: './create-job.css'
})
export class CreateJob implements OnInit {

creatJob!: FormGroup;
minDate:string = ''
locationPattern =/^[A-Za-z\s]+$/

  constructor(
    private fb: FormBuilder,
    private readonly _companyService: CompanyService,
    private readonly _swal: SweetAlert,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute
  ) {
    const day = new Date 
    day.setDate(day.getDate()+1)
    this.minDate = (day.toISOString().split('T')[0])
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
  }

  initForm() {
    this.creatJob = this.fb.group({
      title: ['', [Validators.required,Validators.maxLength(25),Validators.pattern(/^[a-zA-Z0-9 ]*$/)]], 
      description: ['', Validators.required], 
      responsibility: ['', Validators.required],
      jobType: ['', Validators.required], 
      vacancies: [1, [Validators.required, Validators.min(1)]],
      dueDate: ['',[Validators.required]], 
      skills: this.fb.array([], [Validators.required]), 
      location: this.fb.array([], [Validators.required]), 
      experience: this.fb.array([]),
      salary: this.fb.group({
        min: [5000, [Validators.required, Validators.min(0)]],
        max: [25000, [Validators.required, Validators.min(0)]] 
      })
    });
  }

  minArrayLength(min: number) {
    return (control: FormArray) => {
      return control.length >= min ? null : { minArrayLength: { requiredLength: min, actualLength: control.length } };
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

  onSuggestionSelect(index:number,event:Event){
    const value = (event.target as HTMLInputElement).value
    if(value){
      this.skills.at(index).setValue(value)
    }
  }

    removeSkill(index: number) {
    console.log(index)
    this.skills.removeAt(index);
  }


  addLocation() {
    this.locations.push(this.fb.control('',[ Validators.required,Validators.pattern(this.locationPattern)]));
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
    
    console.log('Form Valid:', this.creatJob.valid);
    console.log('Form Errors:', this.getFormValidationErrors());
    
    if (this.creatJob.valid) {
      const data: JobsInterface = this.creatJob.value;
      console.log('Form Submitted Successfully!', data);
      
      this._companyService.addJobs(data).subscribe({
        next: (res) => {
          console.log("Response from backend", res);
          if (res.success) {
            this._swal.showSuccessToast(res.message);
            this._router.navigate(["../"], { relativeTo: this._route });
          }
        },
        error: (err) => {
          console.log(err);
          this._swal.showErrorToast(err.error.message);
        }
      });
    } else {
      console.log('Form is invalid. Please check the required fields.');
    }
  }

  getFormValidationErrors() {
    let formErrors: any = {};
    Object.keys(this.creatJob.controls).forEach(key => {
      const controlErrors = this.creatJob.get(key)?.errors;
      if (controlErrors) {
        formErrors[key] = controlErrors;
      }
    });

    return formErrors;
  }

  isInvalid(controlName: string): boolean {
    const control = this.creatJob.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  isNestedInvalid(groupName: string, controlName: string): boolean {
    const group = this.creatJob.get(groupName) as FormGroup;
    const control = group ? group.get(controlName) : null;
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  isFormArrayControlInvalid(formArray: FormArray, index: number): boolean {
    const control = formArray.at(index);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  isFormArrayInvalid(arrayName: string): boolean {
    const formArray = this.creatJob.get(arrayName) as FormArray;
    return formArray ? formArray.invalid && (formArray.dirty || formArray.touched) : false;
  }

  
}
