import { ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { CompanyProfileInterface, JobsInterface } from '../../interfaces/company.response.interface';
import { CompanyService } from '../../services/company-service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../../common/loading-spinner/loading-spinner';
import { TechLogoPipe } from '../../../../shared/pipes/tech-logo-pipe';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../env/environment';

@Component({
  selector: 'app-company-public-profile',
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, FormsModule, TechLogoPipe],
  templateUrl: './company-public-profile.html',
  styleUrl: './company-public-profile.css'
})
export class CompanyPublicProfileComponent implements OnInit, OnDestroy {

  private _subscription: Subscription = new Subscription()

  isLoading = false
  company$:CompanyProfileInterface | null = null
  jobsLit: JobsInterface[] = []
  companyId:string | null = null
  @ViewChild('teamCardsContainer') teamCardsContainer!: ElementRef;
  cludBaseUrl:string = environment.cloudinaryBaseUrl
  private readonly _logger = inject(LoggerService);

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
        this._logger.log('Viewing company profile:', this.companyId);
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
        this._logger.error("error regarding get company public view profile",err)
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
