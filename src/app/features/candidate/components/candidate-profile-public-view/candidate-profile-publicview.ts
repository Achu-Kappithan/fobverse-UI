import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { CandidateInterface } from '../../interfaces/candidate.interface';
import { CandidateService } from '../../services/candidate.service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../../common/loading-spinner/loading-spinner';
import { environment } from '../../../../../env/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-candidate-profile-publicview',
  imports: [CommonModule,LoadingSpinnerComponent],
  templateUrl: './candidate-profile-publicview.html',
  styleUrl: './candidate-profile-publicview.css'
})
export class CandidateProfilePublicViewComponent implements OnInit {

  isLoading = false
  profileData:CandidateInterface |null = null
  profileId:string |null = null
  resumePdfUrl:string | null = null
  pdfSrc: SafeResourceUrl | null = null;
  cludBaseUrl = environment.cloudinaryBaseUrl
  cludUrl:string = environment.cloudinaryUrl
  private readonly _logger = inject(LoggerService);

  constructor(
    private readonly _candidateService:CandidateService,
    private readonly _toast:ToastService,
    private readonly _cdr:ChangeDetectorRef,
    private readonly _route:ActivatedRoute,
    private readonly _router:Router,
    private readonly _sanitizer: DomSanitizer,
  ){}

  ngOnInit(): void {
    this._route.queryParams.subscribe((val)=>{
      this.profileId = val['id']
      this._logger.log("profile id",this.profileId)
      if(this.profileId){
        this.fetchProfile()
      }
    })
  }

  setResumeUrl(){
    if(this.profileData?.resumeUrl){
      this.resumePdfUrl = `${this.cludUrl}/image/upload${this.profileData.resumeUrl}`;
      this.pdfSrc = this._sanitizer.bypassSecurityTrustResourceUrl(
        this.resumePdfUrl
      );
    }else{
      this.pdfSrc = null;
      this.resumePdfUrl = null
    }
  }

  fetchProfile(){
    this.isLoading = true
    this._candidateService.getPublicView(this.profileId!).subscribe({
      next:(res =>{
        if(res.success){
        this.profileData = res.data
        if (this.profileData.resumeUrl) {
            this.setResumeUrl();
          }
        this.isLoading = false
        this._cdr.detectChanges()
        }
      }),
      error:(err =>{
        this._logger.error("error regading fetch candidate profiel public view",err)
        this._toast.error(err.error.message)
        this.isLoading= false
        this._cdr.detectChanges()
      })
    })
  }

  backbutton(){
    this._router.navigate(['../'],{relativeTo:this._route})
  }
}
