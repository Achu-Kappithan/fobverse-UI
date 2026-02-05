import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from '../../services/company-service';
import { CompanyProfileInterface, TeamMember } from '../../interfaces/company.response.interface';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../../common/loading-spinner/loading-spinner';
import { ActivatedRoute, NavigationEnd, Router, RouterModule,} from '@angular/router';
import { filter, Observable, Subject, switchMap, takeUntil} from 'rxjs';
import { TechLogoPipe } from '../../../../shared/pipes/tech-logo-pipe';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { CloudinaryService } from '../../../../shared/services/cloudinary.service';
import { environment } from '../../../../../env/environment';

@Component({
  selector: 'app-company-profile',
  imports: [CommonModule,LoadingSpinner,RouterModule,TechLogoPipe,ReactiveFormsModule],
  templateUrl: './company-profile.html',
  styleUrl: './company-profile.css',
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }), 
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })) 
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class CompanyProfile implements OnInit,OnDestroy {

  isLoading:boolean = false
  company$:CompanyProfileInterface | null = null
  activeModalId:string | null = null
  ChildRouteActive = false
  logoUrl:string = "/profileimages/logodefault.jpg"
  baseUrl:string = environment.cloudinaryBaseUrl

  teamMembersForm!:FormGroup
  selectedImageFile:File | null = null
  imagePreviewUrl: string | null = null

  @ViewChild('teamCardsContainer') teamCardsContainer!: ElementRef;
  @ViewChild('imagePreview') imagePreviewRef!: ElementRef<HTMLImageElement>;
  defaultImagePreviewSrc: string = ""; 

  private destroy$ = new Subject<void>()

  constructor(
    private readonly _companyService:CompanyService,
    private readonly _cloudinaryService:CloudinaryService,
    private readonly _cdr:ChangeDetectorRef,
    private readonly _router : Router,
    private readonly _route: ActivatedRoute,
    private readonly _toast : ToastService
  ){
  }

  ngOnInit(): void {
    this.initTeamMemberForm()

    this.checkChildRouteStatus()
      this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    )
      .subscribe(() => {
        this.checkChildRouteStatus();
        this._cdr.detectChanges()
      });

    this.isLoading = true
    this._companyService.getCompanyProfile().subscribe({
      next:(res =>{
        this.company$ = res.data
        this.logoUrl = res.data.logoUrl ? this.baseUrl + res.data.logoUrl:"/profileimages/logodefault.jpg"
        this.isLoading = false
        this._cdr.detectChanges()
      }),
      error:(err)=>{
        console.log(err)
        this.isLoading = false
        this._cdr.detectChanges()
      }
    })
  }

  openModal(id:string){
    this.activeModalId = id
    this.teamMembersForm.reset(); 
    this.selectedImageFile = null; 
    this.imagePreviewUrl = this.defaultImagePreviewSrc; 
    if (this.imagePreviewRef) {
        this.imagePreviewRef.nativeElement.src = this.defaultImagePreviewSrc;
    }
    this._cdr.detectChanges(); 
  }

  closeModal(){
    this.activeModalId = null
  }

  isModalOpen(id:string){
    return this.activeModalId ===id
  }

  private checkChildRouteStatus(): void {
    this.ChildRouteActive = this._route.firstChild !== null;
  }

  getContactIcon(type: string): string {
    switch (type) {
      case 'linkedin': return 'fab fa-linkedin';
      case 'twitter': return 'fab fa-twitter';
      case 'facebook': return 'fab fa-facebook';
      case 'email': return 'fas fa-envelope';
      case 'website': return 'fas fa-globe';
      case 'phone': return 'fas fa-phone';
      default: return 'fas fa-link'; 
    }
  }

  // temMember adding modal

  initTeamMemberForm(){
    this.teamMembersForm = new FormGroup({
      name: new FormControl('',Validators.required),
      role: new FormControl('',Validators.required),
    })
    this.imagePreviewUrl = this.defaultImagePreviewSrc
  }

  splitUrl(url: string): string {
  const parts = url.split('/image/upload');
  return parts[1]
  }


  async addTeamMember(){
    if(this.teamMembersForm.valid){
      this.isLoading = true
      const folder = 'team_members';

      const teamData:TeamMember = {
        name: this.teamMembersForm.get('name')?.value,
        role: this.teamMembersForm.get('role')?.value
      }
      let uploadObservable: Observable<any> = new Observable(subscriber => subscriber.next(null))
      const publicIdBase = teamData.name.toLowerCase().replace(/\s/g, '_');

      if(this.selectedImageFile) {
        uploadObservable = this._cloudinaryService.getCloudinarySignature({
          folder:folder,
          publicIdPrefix:publicIdBase
        })
        .pipe(
          switchMap(sigRes => {
            if(sigRes.success && sigRes.data){
              return this._cloudinaryService.uploadFileToCloudinary(
                this.selectedImageFile!,
                sigRes.data,
                folder,
                publicIdBase
              );
            }else{
              throw new Error('Faild to get Cloudinary Signature')
            }
          })
        )
      }

      uploadObservable.subscribe({
        next: (cludUploadResult)=>{
          console.log(cludUploadResult)
          if(cludUploadResult && cludUploadResult.secure_url){
            teamData.image = this.splitUrl(cludUploadResult.secure_url)
          }else{
            teamData.image = undefined
          }

          console.log("team data before send to the backend",teamData)
          this._companyService.addTeamMembers(teamData).subscribe({
            next:(resdata) => {
              console.log('member added response in backend ',resdata)
              if(resdata.success && resdata.data){
                this.company$ = resdata.data
                this.isLoading = false
                this._toast.success(resdata.message)
                this.closeModal(); 
                this.teamMembersForm.reset();
                this.selectedImageFile = null;
                this._cdr.detectChanges()
              }
            },
            error : (error)=>{
              console.log("Error updating profile in backend",error)
              this.isLoading  =false
              this._toast.error(error.error.message)
              this._cdr.detectChanges()
            }
          })
        },
        error:(err)=>{
          console.log("error for updating profile ",err)
          this.isLoading = false
          this._toast.error(err.error.message)
          this._cdr.detectChanges()
        }
      })
    }else{
      this.teamMembersForm.markAllAsTouched()
      this._toast.info("Some of the input fields are missing.")
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0]; 
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result; 
        this._cdr.detectChanges(); 
      };
      reader.readAsDataURL(this.selectedImageFile);
    } else {
      this.selectedImageFile = null; 
      this.imagePreviewUrl = this.defaultImagePreviewSrc; 
      this._cdr.detectChanges(); 
    }
  }

    scrollLeft(): void {
    if (this.teamCardsContainer) {
      this.teamCardsContainer.nativeElement.scrollBy({
        left: -this.teamCardsContainer.nativeElement.offsetWidth / 4, 
        behavior: 'smooth'
      });
    }
  }

  scrollRight(): void {
    if (this.teamCardsContainer) {
      this.teamCardsContainer.nativeElement.scrollBy({
        left: this.teamCardsContainer.nativeElement.offsetWidth / 4, 
        behavior: 'smooth'
      });
    }
  }


  ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
  }
}
