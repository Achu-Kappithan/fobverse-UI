import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company-service';
import { ComapnyProfile } from '../../interfaces/company.responce.interface';
import { copyFileSync } from 'fs';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../../common/loading-spinner/loading-spinner';

@Component({
  selector: 'app-company-profile',
  imports: [CommonModule,LoadingSpinner],
  templateUrl: './company-profile.html',
  styleUrl: './company-profile.css'
})
export class CompanyProfile implements OnInit {

  isLoading:boolean = false
  comapny:ComapnyProfile | null = null
  constructor(
    private readonly _companyService:CompanyService,
    private readonly cdr:ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.isLoading = true
    this._companyService.getProfile().subscribe({
      next:(res =>{
        this.comapny = res.data
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
}
