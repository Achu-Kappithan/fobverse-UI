import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComapnyProfileInterface, ContactInfoItem } from '../../interfaces/company.responce.interface';
import { CompanyProfile } from '../company-profile/company-profile';
import { CompanyService } from '../../services/company-service';

@Component({
  selector: 'app-update-profileinfo',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './update-profileinfo.html',
  styleUrl: './update-profileinfo.css'
})
export class UpdateProfileinfo {
 companyProfileForm!: FormGroup;
 profileData:ComapnyProfileInterface | null = null

  selectedLogoFile: File | null = null;
  logoPreviewUrl: string | ArrayBuffer | null = null;

  selectedGalleryFiles: { file: File, previewUrl: string | ArrayBuffer | null }[] = [];

  currentCompanyProfile:Partial<ComapnyProfileInterface> = {
    name: 'BrotoType',
    logoUrl: 'https://via.placeholder.com/150/92c953',
    description: 'BrotoType is a software platform for starting and running internet businesses. Millions of businesses, from daily to 500-company teams, use BrotoType to securely manage online transactions, get paid, and automate financial processes. We believe that by creating more economic prosperity for everyone, so businesses can focus on building and selling their products. Nomad is a global company. We have teams globally. We are looking for talented and motivated individuals to join our team.',
    industry: 'Software & Non-Profit',
    contactInfo: [
      { type: 'twitter', value: 'twitter.com/nomad' },
      { type: 'facebook', value: 'facebook.com/nomadPG' },
      { type: 'linkedin', value: 'linkedin.com/company/nomad' },
      { type: 'website', value: 'nomad.com' }
    ],
    officeLocation: ['United States', 'England', 'Japan', 'Australia', 'India'],
    techStack: ['HTML', 'CSS', 'JavaScript', 'Python', 'React', 'Node.js'],
    imageGallery: [
    ],
    benafits: [
      'Full Healthcare',
      'Remote Work',
      'Family Support',
      'Paid Time Off',
      'Free Coffee & Snacks',
      'Birthday Bonus'
    ]
  };

  constructor(
    private fb: FormBuilder,
    private readonly _companyService:CompanyService
  ) { }

  ngOnInit(): void {
    console.log("works")
      this._companyService.company$.subscribe((val)=>{
        if (val) {
        this.profileData = val;
        console.log("state Profiledata", this.profileData);
        this.initForm();     
        this.populateForm();    
      }
    })
  }

  initForm(): void {
    this.companyProfileForm = this.fb.group({
      name: [null, Validators.required],
      logoUrl: [null],
      description: [null, Validators.required],
      industry: [null],
      contactInfo: this.fb.array([]),
      officeLocation: this.fb.array([]),
      techStack: this.fb.array([]),
      imageGallery: this.fb.array([]),
      benafits: this.fb.array([])
    });
  }

  populateForm(): void {
    if (this.profileData) {
      this.companyProfileForm.patchValue({
        name: this.profileData.name,
        description: this.profileData.description,
        industry: this.profileData.industry
      });

      if (this.profileData.logoUrl) { 
        this.logoPreviewUrl = this.profileData.logoUrl;
        this.companyProfileForm.get('logoUrl')?.setValue(this.profileData.logoUrl); 
      }

      this.profileData.contactInfo?.forEach(info => this.addContactInfo(info));
      this.profileData.officeLocation?.forEach(loc => this.addOfficeLocation(loc));
      this.profileData.techStack?.forEach(tech => this.addTechStack(tech));
      this.profileData.benafits?.forEach(benefit => this.addBenefit(benefit));

      this.currentCompanyProfile.imageGallery?.forEach(imgUrl => {
        this.selectedGalleryFiles.push({ file: new File([], ''), previewUrl: imgUrl });
        this.imageGallery.push(this.fb.control(imgUrl)); 
      });
    }
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedLogoFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreviewUrl = reader.result;
        this.companyProfileForm.get('logoUrl')?.setValue(reader.result); 
      };
      reader.readAsDataURL(this.selectedLogoFile);
    } else {
      this.selectedLogoFile = null;
      this.logoPreviewUrl = null;
      this.companyProfileForm.get('logoUrl')?.setValue(null);
    }
  }

  removeLogo(): void {
    this.selectedLogoFile = null;
    this.logoPreviewUrl = null;
    this.companyProfileForm.get('logoUrl')?.setValue(null);
    const logoInput = document.getElementById('logoFile') as HTMLInputElement;
    if (logoInput) {
      logoInput.value = '';
    }
  }

  onImageGallerySelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const reader = new FileReader();
        reader.onload = () => {
          const previewUrl = reader.result;
          this.selectedGalleryFiles.push({ file: file, previewUrl: previewUrl });
          this.imageGallery.push(this.fb.control(previewUrl)); 
        };
        reader.readAsDataURL(file);
      }
      input.value = '';
    }
  }

  removeGalleryImage(index: number): void {
    this.selectedGalleryFiles.splice(index, 1);
    this.imageGallery.removeAt(index);
  }


  get contactInfo(): FormArray {
    return this.companyProfileForm.get('contactInfo') as FormArray;
  }

  get officeLocation(): FormArray {
    return this.companyProfileForm.get('officeLocation') as FormArray;
  }

  get techStack(): FormArray {
    return this.companyProfileForm.get('techStack') as FormArray;
  }

  get imageGallery(): FormArray {
    return this.companyProfileForm.get('imageGallery') as FormArray;
  }

  get benafits(): FormArray {
    return this.companyProfileForm.get('benafits') as FormArray;
  }

  addContactInfo(info?: ContactInfoItem): void {
    this.contactInfo.push(this.fb.group({
      type: [info ? info.type : '', Validators.required],
      value: [info ? info.value : '', Validators.required]
    }));
  }

  removeContactInfo(index: number): void {
    this.contactInfo.removeAt(index);
  }

  addOfficeLocation(location?: string): void {
    this.officeLocation.push(this.fb.control(location || '', Validators.required));
  }

  removeOfficeLocation(index: number): void {
    this.officeLocation.removeAt(index);
  }

  addTechStack(tech?: string): void {
    this.techStack.push(this.fb.control(tech || '', Validators.required));
  }

  removeTechStack(index: number): void {
    this.techStack.removeAt(index);
  }

  addImageGallery(image?: string): void {
    if (image) {
      this.selectedGalleryFiles.push({ file: new File([], ''), previewUrl: image });
      this.imageGallery.push(this.fb.control(image));
    }
  }


  addBenefit(benefit?: string): void {
    this.benafits.push(this.fb.control(benefit || '', Validators.required));
  }

  removeBenefit(index: number): void {
    this.benafits.removeAt(index);
  }

  // --- Form Submission ---
  onSubmit(): void {
    if (this.companyProfileForm.valid) {
      const formData = new FormData();

      // Append logo file if selected
      if (this.selectedLogoFile) {
        formData.append('logo', this.selectedLogoFile, this.selectedLogoFile.name);
      }
      // If there's an existing logoUrl and no new file, send the URL
      else if (this.currentCompanyProfile.logoUrl && !this.selectedLogoFile) {
        formData.append('logoUrl', this.currentCompanyProfile.logoUrl);
      }

      const formValue = this.companyProfileForm.value;
      delete formValue.logoUrl; // Don't send this if you're sending the file
      delete formValue.imageGallery; // Don't send this directly if files are sent separately

      // Append other form fields as JSON string or individual fields
      formData.append('companyProfileData', JSON.stringify(formValue));


      // Append gallery images
      // this.selectedGalleryFiles.forEach((item, index) => {
      //   if (item.file && item.file.name) { // Check if it's a new file, not just a pre-existing URL
      //      formData.append(`galleryImage${index}`, item.file, item.file.name);
      //   } else if (item.previewUrl) { // Existing image URL
      //      formData.append(`existingGalleryImageUrls`, item.previewUrl);
      //   }
      // });


      console.log('Form Submitted!', this.companyProfileForm.value);
      console.log('Selected Logo File:', this.selectedLogoFile);
      console.log('Selected Gallery Files:', this.selectedGalleryFiles.map(f => f.file?.name || f.previewUrl));

      // Example of how you might send data (using HttpClient service)
      // this.yourApiService.updateCompanyProfile(formData).subscribe(response => {
      //   console.log('Update successful', response);
      // }, error => {
      //   console.error('Update failed', error);
      // });

    } else {
      console.log('Form is invalid. Please check the fields.');
      this.companyProfileForm.markAllAsTouched();
    }
  }
}
