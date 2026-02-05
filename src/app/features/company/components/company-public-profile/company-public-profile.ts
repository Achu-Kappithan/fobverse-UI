import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CompanyProfileInterface, JobsInterface } from '../../interfaces/company.response.interface';
import { CompanyService } from '../../services/company-service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../../common/loading-spinner/loading-spinner';
import { TechLogoPipe } from '../../../../shared/pipes/tech-logo-pipe';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../env/environment';

@Component({
  selector: 'app-company-public-profile',
  imports: [CommonModule,RouterModule,LoadingSpinner,TechLogoPipe],
  templateUrl: './company-public-profile.html',
  styleUrl: './company-public-profile.css'
})
export class CompanyPublicProfile implements OnInit, OnDestroy {

  private _subscription: Subscription = new Subscription()

  isLoading:boolean = false
  company$:CompanyProfileInterface | null = null
  jobsLit: JobsInterface[] = []
  companyId:string | null = null
  @ViewChild('teamCardsContainer') teamCardsContainer!: ElementRef;
  cludBaseUrl:string = environment.cloudinaryBaseUrl


  constructor(
    private readonly _companyService:CompanyService,
    private readonly _toast:ToastService,
    private readonly _cdr:ChangeDetectorRef,
    private readonly _route:ActivatedRoute,
    private readonly _router:Router 
  ){}

  ngOnInit(): void {
    this._subscription.add(
      this._route.queryParams.subscribe((val)=>{
        this.companyId = val['id']
        console.log(this.companyId)
        if(this.companyId){
          this.fetchCompanyDetails()
        }
      })
    )
  }

  fetchCompanyDetails(){
    this.isLoading = true
    this._companyService.getPublicView(this.companyId!).subscribe({
       next:(res => {
        if(res.success){
          this.company$ = res.data.company
          this.jobsLit = res.data.jobs
          this.isLoading = false
          this._cdr.detectChanges()
        }
       }),
       error:(err =>{
        console.log("error regarding get company public view profile",err)
        this._toast.error(err.error.message)
        this.isLoading = false
        this._cdr.detectChanges()
       })
    })
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

  backto(){
    this._router.navigate(['../'],{relativeTo:this._route})
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }

}
