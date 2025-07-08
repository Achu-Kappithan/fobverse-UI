import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside';
import { AdminCandidate } from '../../services/admin-candidate';
import { CandidateInterface } from '../../interfaces/company.interface';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../../common/loading-spinner/loading-spinner';

@Component({
  selector: 'app-admin-candidates-list',
  imports: [ClickOutsideDirective, CommonModule,LoadingSpinner],
  templateUrl: './admin-candidates-list.html',
  styleUrl: './admin-candidates-list.css',
})
export class AdminCandidatesList  implements OnInit {
  isdorpDownOpen: { [id: string]: boolean } = {};
  isLoading:boolean = false
  candidates:CandidateInterface[] = []

  constructor( 
    private readonly _adminCandidateService:AdminCandidate,
    private readonly cdr :ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchAllCandidates()
  }

  UpdateStatus(candidate:CandidateInterface){
    this._adminCandidateService.updateStatus(candidate.id).subscribe({
      next:(res)=>{
        if(res.success){
          console.log("updated status ",res)
          candidate.isActive = !candidate.isActive
          this.cdr.detectChanges()
        }
      }
    })
  }

  fetchAllCandidates(){
    this.isLoading = true
    setTimeout(()=>{
      this._adminCandidateService.getAllCandidates().subscribe({
        next:(response)=>{
          if(response.success && response.data){
            this.candidates = response.data
            console.log("responce data",response.data)
          }else{
            console.log("faild to get responce",response)
            this.candidates = []
          }
          this.isLoading = false
          this.cdr.detectChanges()
        },
        error:(err)=>{
          console.log("error  while fetching the candiate list",err)
          this.candidates = []
          this.isLoading = false
          this.cdr.detectChanges()
        }
      })
    })
  }

   toggleDropdown(id: string) {
    this.isdorpDownOpen[id] = !this.isdorpDownOpen[id];
    console.log(this.isdorpDownOpen)
  }

  closeDropdown(id: string) {
    this.isdorpDownOpen[id] = false;
  }
}
