import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CandidateInterface } from '../../interfaces/candidate.interface';
import { CandidateService } from '../../services/candidate.service';
import { SweetAlert } from '../../../../shared/services/sweet-alert';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../../common/loading-spinner/loading-spinner';

@Component({
  selector: 'app-candidate-profile-publicview',
  imports: [CommonModule,LoadingSpinner,],
  templateUrl: './candidate-profile-publicview.html',
  styleUrl: './candidate-profile-publicview.css'
})
export class CandidateProfilePublicview implements OnInit {

  isLoading:boolean = false
  profileData:CandidateInterface |null = null
  profileId:string |null = null

  constructor(
    private readonly _candidateService:CandidateService,
    private readonly _swal:SweetAlert,
    private readonly _cdr:ChangeDetectorRef,
    private readonly _route:ActivatedRoute,
    private readonly _router:Router
  ){}

  ngOnInit(): void {
    this._route.queryParams.subscribe((val)=>{
      this.profileId = val['id']
      console.log("profile id",this.profileId)
      if(this.profileId){
        this.fetchProfile()
      }
    })
  }

  fetchProfile(){
    this.isLoading = true
    this._candidateService.getPublicView(this.profileId!).subscribe({
      next:(res =>{
        if(res.success){
        this.profileData = res.data
        this.isLoading = false
        this._cdr.detectChanges()
        }
      }),
      error:(err =>{
        console.log("error regading fetch candidate profiel public view",err)
        this._swal.showErrorToast(err.error.message)
        this.isLoading= false
        this._cdr.detectChanges()
      })
    })
  }

  backbutton(){
    this._router.navigate(['../'],{relativeTo:this._route})
  }
}
