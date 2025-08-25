import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CandidateJobsInterface } from '../../interfaces/candidate.joblist.interface';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-candidate-applyjob',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './candidate-applyjob.html',
  styleUrl: './candidate-applyjob.css'
})
export class CandidateApplyjob implements OnInit {

  @Input() isOpen:boolean = false
  @Input() uniqueIdentifier:string = ''
  @Input() jobDetails:CandidateJobsInterface | undefined = undefined

  @Output() close:EventEmitter<void> = new EventEmitter<void>()

  jobApplayForm!: FormGroup
  selectedFileName: string = '';

  constructor(
    private fb:FormBuilder,
  ){}

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.jobApplayForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      experience: ['', [Validators.required]],
      qualification: ['', [Validators.required]],
      resume: [null, [Validators.required, this.fileValidator()]]
    });
  }

  onFileSelected(event: Event) {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
          this.jobApplayForm.patchValue({ resume: file });
          this.jobApplayForm.get('resume')?.updateValueAndValidity();
          this.selectedFileName = file.name;
      } else {
          this.selectedFileName = '';
      }
    }

  fileValidator() {
    return (control: FormControl) => {
      const file = control.value;
      if (file) {
        const fileType = file.name.split('.').pop()?.toLowerCase();
        if (fileType !== 'pdf') {
          return { invalidFileType: true };
        }
      }
      return null;
    };
  }

  onClose(){
    this.close.emit()
  }

  handleSubmit() {
    if (this.jobApplayForm.valid) {
      console.log('Form is valid and ready for submission.');
      this.jobApplayForm.reset();
      this.onClose();
    } else {
      console.log('Form is invalid. Please correct the errors.');
      this.jobApplayForm.markAllAsTouched();
    }
  }


}
