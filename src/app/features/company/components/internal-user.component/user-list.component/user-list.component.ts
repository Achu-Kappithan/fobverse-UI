import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InternalUserInterface } from '../../../interfaces/company.responce.interface';
import { CompanyService } from '../../../services/company-service';
import { LoadingSpinner } from '../../../../../common/loading-spinner/loading-spinner';
import { CommonModule } from '@angular/common';
import { RoleDisplayPipe } from '../../../../../shared/pipes/role-display-pipe';

@Component({
  selector: 'app-user-list.component',
  imports: [RouterModule,LoadingSpinner,CommonModule,RoleDisplayPipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  
  isLoading:boolean = false
  InternalUsers:InternalUserInterface[]=[]

  constructor(
    private readonly _ComapnyService: CompanyService,
    private  cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.isLoading = true
    this._ComapnyService.getInternalUsers().subscribe({
      next:(res =>{
        if(res.success){
          console.log("internal useres :",res.data)
          this.InternalUsers = res.data
        }
        this.isLoading = false
        this.cdr.detectChanges()
      }),
      error:(err =>{
        console.log(err)
        this.isLoading= false
        this.cdr.detectChanges()
      })
    })
  }

  removeUser(id:string){

  }
}
