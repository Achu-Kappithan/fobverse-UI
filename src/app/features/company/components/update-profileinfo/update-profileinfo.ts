import { CommonModule, UpperCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComapnyProfileInterface, ContactInfoItem } from '../../interfaces/company.responce.interface';
import { CompanyService } from '../../services/company-service';
import { SweetAlert } from '../../../../shared/services/sweet-alert';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GalleryImageDisplay } from '../../interfaces/cloudinarysignature.responce.interface';
import { catchError, filter, forkJoin, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-update-profileinfo',
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './update-profileinfo.html',
  styleUrl: './update-profileinfo.css'
})
export class UpdateProfileinfo implements OnInit ,OnDestroy {
 companyProfileForm!: FormGroup;
 profileData:ComapnyProfileInterface | null = null
 loading:boolean = false

  selectedLogoFile: File | null = null;
  logoPreviewUrl: string | ArrayBuffer | null = null

  imageGalleryDisplay: GalleryImageDisplay[] = [];

  private destroy$ = new Subject<void>()

  constructor(
    private  fb: FormBuilder,
    private readonly _companyService:CompanyService,
    private readonly cdr : ChangeDetectorRef,
    private readonly swal : SweetAlert,
    private readonly _router :Router,
    private readonly _route :ActivatedRoute
  ) { }

  ngOnInit(): void {
      this.initForm();
      this._companyService.company$.subscribe((val)=>{
        if (val) {
        this.profileData = val;
        console.log("state Profiledata", this.profileData);
        this.populateForm();
        this.cdr.detectChanges()   
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.companyProfileForm = this.fb.group({
      name: [null, Validators.required],
      logoUrl: [null],
      description: [null,Validators.required],
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

      this.contactInfo.clear();
      this.officeLocation.clear();
      this.techStack.clear();
      this.benafits.clear();
      this.imageGallery.clear(); 
      this.imageGalleryDisplay = [];

      if (this.profileData.logoUrl) { 
        this.logoPreviewUrl = this.profileData.logoUrl;
        this.companyProfileForm.get('logoUrl')?.setValue(this.profileData.logoUrl); 
      }

      this.profileData.contactInfo?.forEach(info => this.addContactInfo(info));
      this.profileData.officeLocation?.forEach(loc => this.addOfficeLocation(loc));
      this.profileData.techStack?.forEach(tech => this.addTechStack(tech));
      this.profileData.benafits?.forEach(benefit => this.addBenefit(benefit));

      this.profileData.imageGallery?.forEach(imgUrl => {
      this.imageGallery.push(this.fb.control(imgUrl));
      this.imageGalleryDisplay.push({file:null,publicId:this.extractPublicId(imgUrl), url: imgUrl, isNew: false })
      });
    }
  }

  private extractPublicId(url: string): string | null {
    const match = url.match(/v\d+\/(.+)\.\w+$/);
    if (match && match[1]) {
      return match[1];
    }
    console.warn('Could not extract publicId from URL:', url);
    return null;
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedLogoFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreviewUrl = reader.result;
        this.cdr.detectChanges() 
      };
      reader.readAsDataURL(this.selectedLogoFile);
    } else {
      this.removeLogo()
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
    this.cdr.detectChanges()
  }

  onImageGallerySelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const reader = new FileReader();
        reader.onload = () => {
          const previewUrl = reader.result;
          this.imageGalleryDisplay.push({ file: file, publicId: null, url: previewUrl, isNew: true });
          this.cdr.detectChanges()
        };
        reader.readAsDataURL(file);
        }
      input.value = '';
    }
  }

  removeGalleryImage(index: number): void {
    const removedImage = this.imageGalleryDisplay[index];
    this.imageGalleryDisplay.splice(index, 1);
    this.rebuildImageGalleryFormArray();
    this.cdr.detectChanges()
  }

  private rebuildImageGalleryFormArray(): void {
    this.imageGallery.clear(); 
    this.imageGalleryDisplay
      .filter(item => !item.isNew && item.url) 
      .map(item => item.url as string)
      .forEach(url => this.imageGallery.push(new FormControl(url)));
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
    this.cdr.detectChanges()
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

  addBenefit(benefit?: string): void {
    this.benafits.push(this.fb.control(benefit || '', Validators.required));
  }

  removeBenefit(index: number): void {
    this.benafits.removeAt(index);
  }

  async onSubmit():Promise<void> {
    if (this.companyProfileForm.invalid) {
      this.swal.showErrorToast('Please fill in all required fields')
      this.companyProfileForm.markAllAsTouched()
      return
    }
    this.loading = true
    this.swal.showLoadingToast('Uploading images and updating profile....')

 try {
      const uploadObservables: Observable<any>[] = [];
      const uploadedImageResults: { url: string | null, publicId: string | null, isLogo: boolean, originalFileRef?: File }[] = [];

      if (this.selectedLogoFile) {
        const companyNameSlug = this.companyProfileForm.get('name')?.value?.toLowerCase().replace(/\s/g, '_') || 'default';
        const logoUpload$ = this._companyService.getCloudinarySignature({
          folder: 'company_logos',
          publicIdPrefix: `${companyNameSlug}_logo_${Date.now()}`
        }).pipe(
          switchMap(resSignature =>
            this._companyService.uploadFileToCloudinary(
              this.selectedLogoFile!,
              resSignature.data,
              'company_logos',
              resSignature.data.publicId || `${companyNameSlug}_logo_${Date.now()}`
            )
          ),
          catchError(error => {
            console.error('Logo upload failed:', error);
            this.swal.showErrorToast('Failed to upload company logo.');
            return of(null); 
          })
        );
        uploadObservables.push(logoUpload$.pipe(
          switchMap(result => of({ ...result, isLogo: true, originalFileRef: this.selectedLogoFile }))
        ));
      }

      this.imageGalleryDisplay.filter(item => item.isNew && item.file).forEach((item, index) => {
        const companyNameSlug = this.companyProfileForm.get('name')?.value?.toLowerCase().replace(/\s/g, '_') || 'default';
        const galleryUpload$ = this._companyService.getCloudinarySignature({
          folder: 'company_gallery',
          publicIdPrefix: `${companyNameSlug}_gallery_${Date.now()}_${index}`
        }).pipe(
          switchMap(resSignature =>
            this._companyService.uploadFileToCloudinary(
              item.file!,
              resSignature.data,
              'company_gallery',
              resSignature.data.publicId || `${companyNameSlug}_gallery_${Date.now()}_${index}`
            )
          ),
          catchError(error => {
            console.error(`Gallery image ${index} upload failed:`, error);
            this.swal.showErrorToast(`Failed to upload gallery image ${index + 1}.`);
            return of(null);
          })
        );
        uploadObservables.push(galleryUpload$.pipe(
          switchMap(result => of({ ...result, isLogo: false, originalFileRef: item.file }))
        ));
      });

      if (uploadObservables.length > 0) {
        const rawUploadResults = await forkJoin(uploadObservables).pipe(takeUntil(this.destroy$)).toPromise();
        rawUploadResults?.forEach(result => {
          if (result && result.secure_url) {
            uploadedImageResults.push({
              url: result.secure_url,
              publicId: result.public_id,
              isLogo: result.isLogo,
              originalFileRef: result.originalFileRef 
            });
          }
        });
      }

      const finalFormData = { ...this.companyProfileForm.value };

      const newLogoResult = uploadedImageResults.find(r => r.isLogo);
      if (newLogoResult?.url) {
        finalFormData.logoUrl = newLogoResult.url;
        this.selectedLogoFile = null;
        this.logoPreviewUrl = newLogoResult.url;
      } else if (!this.selectedLogoFile && this.companyProfileForm.get('logoUrl')?.value) {
        finalFormData.logoUrl = this.companyProfileForm.get('logoUrl')?.value;
      } else {
        finalFormData.logoUrl = null; 
      }

      const existingGalleryItems = this.imageGalleryDisplay.filter(item => !item.isNew);
      const newGalleryResults = uploadedImageResults.filter(r => !r.isLogo && r.url);

      const combinedGalleryItems: GalleryImageDisplay[] = [
        ...existingGalleryItems,
        ...newGalleryResults.map(r => ({ file: null, publicId: r.publicId, url: r.url, isNew: false }))
      ];

      finalFormData.imageGallery = combinedGalleryItems.map(item => item.url);
      this.imageGalleryDisplay = combinedGalleryItems;

      this.imageGallery.clear(); 
      finalFormData.imageGallery.forEach((url: string) => this.imageGallery.push(new FormControl(url)));
      this.companyProfileForm.get('logoUrl')?.setValue(finalFormData.logoUrl);

      const res = await this._companyService.updateProfile(finalFormData)
        .pipe(takeUntil(this.destroy$))
        .toPromise();

      if (res && res.success) {
        this.swal.showSuccessToast(res.message);
        this._router.navigate(["../"],{ relativeTo: this._route })
      } else {
        this.swal.showErrorToast(res!.message);
      }

    } catch (error: any) {
      console.error("Profile update failed:", error);
      this.swal.showErrorToast(error.error?.message || 'An unexpected error occurred during profile update.');
    } finally {
      this.loading = false;
      this.swal.closeToast(); 
      this.cdr.detectChanges(); 
    }
  }
}
