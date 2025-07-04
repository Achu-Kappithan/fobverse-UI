import { Component, OnInit } from '@angular/core';
import { AdminCompanyService } from '../../services/admin-company-service';

@Component({
  selector: 'app-admin-listcompanys',
  imports: [],
  templateUrl: './admin-listcompanys.html',
  styleUrl: './admin-listcompanys.css'
})
export class AdminListcompanys implements OnInit {

  companies:[] = []

  constructor(
    private readonly _companyService:AdminCompanyService
  ) {}


  ngOnInit(): void {
    this.fetchAllcompany()
  
  }

  fetchAllcompany(){
    // setTimeout(()=>{
      this._companyService.getAllCompanies().subscribe({
        next:(response)=>{
         if (response ) {
          console.log("Companies fetched:",response);
        } else {
          console.error("Failed to fetch companies or data is empty:", response);
        }
      },
      error: (err) => {
        console.error("Error fetching companies:", err);
      }
      })
    // },300)
  }
}
