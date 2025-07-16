import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company-service';
import { ComapnyProfileInterface } from '../../interfaces/company.responce.interface';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../../common/loading-spinner/loading-spinner';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { TechLogoPipe } from '../../../../shared/pipes/tech-logo-pipe';

@Component({
  selector: 'app-company-profile',
  imports: [CommonModule,LoadingSpinner,RouterModule,TechLogoPipe],
  templateUrl: './company-profile.html',
  styleUrl: './company-profile.css'
})
export class CompanyProfile implements OnInit {

  isLoading:boolean = false
  company$:ComapnyProfileInterface | null = null
  activeModalId:string | null = null
  ChildRouteActive = false
  logoUrl:string = "/profileimages/logodefault.jpg"

  private destroy$ = new Subject<void>()

  constructor(
    private readonly _companyService:CompanyService,
    private readonly cdr:ChangeDetectorRef,
    private readonly _router : Router,
    private readonly _route: ActivatedRoute
  ){
  }

  ngOnInit(): void {
    this.checkChildRouteStatus()
      this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    )
      .subscribe(() => {
        this.checkChildRouteStatus();
        this.cdr.detectChanges()
      });

    this.isLoading = true
    this._companyService.getProfile().subscribe({
      next:(res =>{
        this.company$ = res.data
        this.logoUrl = res.data.logoUrl ?? "/profileimages/logodefault.jpg"
        this.isLoading = false
        this.cdr.detectChanges()
      }),
      error:(err)=>{
        console.log(err)
        this.isLoading = false
        this.cdr.detectChanges()
      }
    })
  }

  openModal(id:string){
    this.activeModalId = id
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

  ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
  }
}
