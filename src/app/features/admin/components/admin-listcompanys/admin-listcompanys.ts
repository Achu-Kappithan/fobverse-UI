import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminCompanyService } from '../../services/admin-company-service';
import { Observable } from 'rxjs';
import { ApiResponce } from '../../../auth/interfaces/api-responce.interface';
import { CompanyInterface } from '../../interfaces/company.interface';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../../common/loading-spinner/loading-spinner';
import { SweetAlert } from '../../../../shared/services/sweet-alert';

@Component({
  selector: 'app-admin-listcompanys',
  imports: [CommonModule,LoadingSpinner],
  templateUrl: './admin-listcompanys.html',
  styleUrl: './admin-listcompanys.css'
})
export class AdminListcompanys implements OnInit {

  companies:CompanyInterface[] = []
  isLoading:boolean = false
  logoUrl:string ='/profileimages/logodefault.jpg'

  constructor(
    private readonly _companyService:AdminCompanyService,
    private cdr: ChangeDetectorRef,
    private readonly _swal: SweetAlert
  ) {}


  ngOnInit(): void {
    this.fetchAllcompany()
  }

  UpdateStatus(company: CompanyInterface): void {
    console.log("updatestaus",company._id)
    this._companyService.updateStatus(company._id).subscribe({
      next:(res)=>{
        if(res.success){
          company.isActive = !company.isActive;
          this.cdr.detectChanges()
          this._swal.showSuccessToast(res.message)
          console.log("status update responce ",res)
        }else {
          console.log("error regading updating status",res)
        }
      },
      error:(err)=>{
        console.log("staus updation faild ",err)
        this._swal.showErrorToast(err.error.message)
      }
    })

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
