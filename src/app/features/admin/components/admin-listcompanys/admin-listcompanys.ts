import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminCompanyService } from '../../services/admin-company-service';
import { Observable } from 'rxjs';
import { ApiResponce } from '../../../auth/interfaces/api-responce.interface';
import { CompanyInterface } from '../../interfaces/company.interface';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../../common/loading-spinner/loading-spinner';

@Component({
  selector: 'app-admin-listcompanys',
  imports: [CommonModule,LoadingSpinner],
  templateUrl: './admin-listcompanys.html',
  styleUrl: './admin-listcompanys.css'
})
export class AdminListcompanys implements OnInit {

  companies:CompanyInterface[] = []
  isLoading:boolean = false

  constructor(
    private readonly _companyService:AdminCompanyService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.fetchAllcompany()
  }

  toggleCompanyStatus(company: CompanyInterface): void {
    company.isActive = !company.isActive;
    console.log(`Company ${company.companyName} status toggled to: ${company.isActive ? 'Active' : 'Blocked'}`);
  }

  fetchAllcompany(){
      this.isLoading = true
      setTimeout(()=>{
        this._companyService.getAllCompanies().subscribe({
          next: (response) => {
          if (response && response.success) {
            this.companies = response.data ?? [];
            console.log("assigneddata", this.companies);
          } else {
            console.error("Failed to fetch companies or data is unsuccessful:", response);
            this.companies = [];
          }
          this.isLoading = false
          this.cdr.detectChanges()
        },
        error: (err) => {
          console.error("Error fetching companies:", err);
          this.companies = [];
          this.isLoading = false
          this.cdr.detectChanges()
        }
      })
    })
 }
}
