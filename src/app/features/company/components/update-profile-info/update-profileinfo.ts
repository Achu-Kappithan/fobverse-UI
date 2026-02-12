import { CommonModule} from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { LoadingSpinnerComponent } from '../../../../common/loading-spinner/loading-spinner';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactInfoItem, CompanyProfileInterface } from '../../interfaces/company.response.interface';
import { CompanyService } from '../../services/company-service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError,forkJoin, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { GalleryImageDisplay } from '../../../../shared/interfaces/cloudinary-signature.response.interface';
import { CloudinaryService } from '../../../../shared/services/cloudinary.service';


@Component({
  selector: 'app-update-profileinfo',
  imports: [CommonModule,ReactiveFormsModule,RouterModule, LoadingSpinnerComponent],
  templateUrl: './update-profileinfo.html',
  styleUrl: './update-profileinfo.css'
})
export class UpdateProfileInfoComponent implements OnInit, OnDestroy {
 companyProfileForm!: FormGroup;
 profileData:CompanyProfileInterface | null = null
 isSaving = false
 baseUrl = "https://res.cloudinary.com/dl9iuhkmq/image/upload"

  selectedLogoFile: File | null = null;
  logoPreviewUrl: string | ArrayBuffer | null = null

  imageGalleryDisplay: GalleryImageDisplay[] = [];
  private loadingToastId: number | null = null;

  private destroy$ = new Subject<void>()
  private readonly _logger = inject(LoggerService);

  constructor(
    private  fb: FormBuilder,
    private readonly _companyService:CompanyService,
    private readonly _cloudinaryService:CloudinaryService,
    private readonly _cdr : ChangeDetectorRef,
    private readonly _toast : ToastService,
    private readonly _router :Router,
    private readonly _route :ActivatedRoute
  ) { }

  ngOnInit(): void {
      this.initForm();
      this._companyService.companyProfile$.subscribe((val)=>{
        if (val) {
        this.profileData = val;
        this._logger.log("Profile data loaded", { name: this.profileData?.name });
        this.populateForm();
        this._cdr.detectChanges()   
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.companyProfileForm = this.fb.group({
      name: [null, [Validators.required,Validators.maxLength(20),Validators.pattern(/^(?!\d+$)(?![^a-zA-Z]+$)[a-zA-Z\s]+$/)]],
      logoUrl: [null],
      description: [null,[Validators.required,]],
      industry: [null,[Validators.required,Validators.maxLength(20)]],
      contactInfo: this.fb.array([]),
      officeLocation: this.fb.array([]),
      techStack: this.fb.array([]),
      imageGallery: this.fb.array([]),
      benefits: this.fb.array([])
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
      this.benefits.clear();
      this.imageGallery.clear(); 
      this.imageGalleryDisplay = [];

      if (this.profileData.logoUrl) { 
        this.logoPreviewUrl = this.profileData.logoUrl;
        this.logoPreviewUrl = this.baseUrl+this.profileData.logoUrl;
        this.companyProfileForm.get('logoUrl')?.setValue(this.profileData.logoUrl); 
      }

      this.profileData.contactInfo?.forEach(info => this.addContactInfo(info));
      this.profileData.officeLocation?.forEach(loc => this.addOfficeLocation(loc));
      this.profileData.techStack?.forEach(tech => this.addTechStack(tech));
      this.profileData.benefits?.forEach(benefit => this.addBenefit(benefit));

      this.profileData.imageGallery?.forEach(imgUrl => {
      const fullUrl = `https://res.cloudinary.com/dl9iuhkmq/image/upload${imgUrl}`
      this.imageGallery.push(this.fb.control(imgUrl));
      this.imageGalleryDisplay.push({file:null,publicId:this.extractPublicId(fullUrl), url: fullUrl, isNew: false })
      });
    }
  }

  private extractPublicId(url: string): string | null {
    const match = url.match(/v\d+\/(.+)\.\w+$/);
    if (match && match[1]) {
      return match[1];
    }
    this._logger.warn('Could not extract publicId from URL:', url);
    return null;
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedLogoFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreviewUrl = reader.result;
        this._cdr.detectChanges() 
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
    this._cdr.detectChanges()
  }

  onImageGallerySelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (const file of Array.from(input.files)) {
        const reader = new FileReader();
        reader.onload = () => {
          const previewUrl = reader.result;
          this.imageGalleryDisplay.push({ file: file, publicId: null, url: previewUrl, isNew: true });
          this._cdr.detectChanges()
        };
        reader.readAsDataURL(file);
        }
      input.value = '';
    }
  }

  removeGalleryImage(index: number): void {
    // const removedImage = this.imageGalleryDisplay[index];
    this.imageGalleryDisplay.splice(index, 1);
    this.rebuildImageGalleryFormArray();
    this._cdr.detectChanges()
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

  get benefits(): FormArray {
    return this.companyProfileForm.get('benefits') as FormArray;
  }

  addContactInfo(info?: ContactInfoItem): void {
    this.contactInfo.push(this.fb.group({
      type: [info ? info.type : '', Validators.required],
      value: [info ? info.value : '', Validators.required]
    }));
    this._cdr.detectChanges()
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
    this.benefits.push(this.fb.control(benefit || '', Validators.required));
  }

  removeBenefit(index: number): void {
    this.benefits.removeAt(index);
  }

  private stripCloudinaryBase(url: string): string {
  const parts = url.split('/image/upload');
  return parts[1]
  }

  async onSubmit():Promise<void> {
    if (this.companyProfileForm.invalid) {
      this._toast.error('Please fill all required fields')
      this.companyProfileForm.markAllAsTouched()
      return
    }
    this.isSaving = true

 try {
      const uploadObservables: Observable<Record<string, unknown> | null>[] = [];
      const uploadedImageResults: { url: string | null, publicId: string | null, isLogo: boolean, originalFileRef?: File }[] = [];

      if (this.selectedLogoFile) {
        const companyNameSlug = this.companyProfileForm.get('name')?.value?.toLowerCase().replace(/\s/g, '_') || 'default';
        const logoUpload$ = this._cloudinaryService.getCloudinarySignature({
          folder: 'company_logos',
          publicIdPrefix: `${companyNameSlug}_logo_${Date.now()}`
        }).pipe(
          switchMap(resSignature =>
            this._cloudinaryService.uploadFileToCloudinary(
              this.selectedLogoFile!,
              resSignature.data,
              'company_logos',
              resSignature.data.publicId || `${companyNameSlug}_logo_${Date.now()}`
            )
          ),
          catchError(error => {
            this._logger.error('Logo upload failed:', error);
            this._toast.error('Failed to upload company logo.');
            return of(null); 
          })
        );
        uploadObservables.push(logoUpload$.pipe(
          switchMap(result => of({ ...result, isLogo: true, originalFileRef: this.selectedLogoFile }))
        ));
      }

      this.imageGalleryDisplay.filter(item => item.isNew && item.file).forEach((item, index) => {
        const companyNameSlug = this.companyProfileForm.get('name')?.value?.toLowerCase().replace(/\s/g, '_') || 'default';
        const galleryUpload$ = this._cloudinaryService.getCloudinarySignature({
          folder: 'company_gallery',
          publicIdPrefix: `${companyNameSlug}_gallery_${Date.now()}_${index}`
        }).pipe(
          switchMap(resSignature =>
            this._cloudinaryService.uploadFileToCloudinary(
              item.file!,
              resSignature.data,
              'company_gallery',
              resSignature.data.publicId || `${companyNameSlug}_gallery_${Date.now()}_${index}`
            )
          ),
          catchError(error => {
            this._logger.error(`Gallery image ${index} upload failed:`, error);
            this._toast.error(`Failed to upload gallery image ${index + 1}.`);
            return of(null);
          })
        );
        uploadObservables.push(galleryUpload$.pipe(
          switchMap(result => of({ ...result, isLogo: false, originalFileRef: item.file }))
        ));
      });

      if (uploadObservables.length > 0) {
        const rawUploadResults = await forkJoin(uploadObservables).pipe(takeUntil(this.destroy$)).toPromise() as (Record<string, unknown> & { isLogo: boolean, originalFileRef?: File} | null)[];
        rawUploadResults?.forEach(result => {
            if (result && (result as Record<string, unknown>)['secure_url']) {
            uploadedImageResults.push({
              url: (result as Record<string, unknown>)['secure_url'] as string,
              publicId: (result as Record<string, unknown>)['public_id'] as string,
              isLogo: result.isLogo,
              originalFileRef: result.originalFileRef 
            });
          }
        });
      }

      const finalFormData = { ...this.companyProfileForm.value };
      const newLogoResult = uploadedImageResults.find(r => r.isLogo);
      if (newLogoResult?.url) {
        finalFormData.logoUrl = this.stripCloudinaryBase(newLogoResult.url)
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

      finalFormData.imageGallery = combinedGalleryItems.map(item => this.stripCloudinaryBase(item.url as string));
      this.imageGalleryDisplay = combinedGalleryItems;

      this.imageGallery.clear(); 
      finalFormData.imageGallery.forEach((url: string) => this.imageGallery.push(new FormControl(url)));
      this.companyProfileForm.get('logoUrl')?.setValue(finalFormData.logoUrl);

      const res = await this._companyService.updateCompanyProfile(finalFormData)
        .pipe(takeUntil(this.destroy$))
        .toPromise();

      if (res && res.success) {
        this._toast.success(res.message);
        this._router.navigate(["../"],{ relativeTo: this._route })
      } else {
        this._toast.error(res!.message);
      }

    } catch (error: unknown) {
      this._logger.error("Profile update failed:", error);
      const errorObj = error as { error?: { message?: string } };
      this._toast.error(errorObj?.error?.message || 'An unexpected error occurred during profile update.');
    } finally {
      this.isSaving = false;
      this._cdr.detectChanges(); 
    }
  }
}
