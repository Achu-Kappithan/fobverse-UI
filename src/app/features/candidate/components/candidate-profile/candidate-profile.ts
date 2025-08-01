import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CandidateInterface } from '../../interfaces/candidate.interface';
import { CandidateService } from '../../services/candidate.service';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../../common/loading-spinner/loading-spinner';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-candidate-profile',
  imports: [CommonModule,LoadingSpinner,RouterModule],
  templateUrl: './candidate-profile.html',
  styleUrl: './candidate-profile.css'
})
export class CandidateProfile implements OnInit {
  
  profileData:CandidateInterface | null = null
  isLoading:boolean = false

  constructor(
    private readonly _candidateService:CandidateService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getProfile()
  }

  getProfile(){
    this.isLoading = true
    this._candidateService.GetPorfile().subscribe({
      next:(profile =>{
        if(profile.success){
          this.profileData = profile.data
          console.log("Profile data",this.profileData)
          this.isLoading = false
          this.cdr.detectChanges()
        }
      }),
      error:(err =>{
        console.log("error regading candidate profile fetching",err)
        this.isLoading = false
        this.cdr.detectChanges()
      })
    })
  }
}
