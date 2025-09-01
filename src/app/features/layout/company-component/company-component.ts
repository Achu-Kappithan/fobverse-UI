import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyHeader } from '../../../common/company-header/company-header';
import { CompanySidebar } from '../../../common/company-sidebar/company-sidebar';
import { AutoCollapseSidebar } from '../../../shared/directives/auto-collapse-sidebar';

@Component({
  selector: 'app-company-component',
  imports: [CommonModule,RouterModule,CompanyHeader,CompanySidebar,AutoCollapseSidebar],
  templateUrl: './company-component.html',
  styleUrl: './company-component.css'
})
export class CompanyComponent {
  isSidebarOpen: boolean = false

  onSidebarToggle(isOpen:boolean){
    this.isSidebarOpen = isOpen
  }


  handleSidebarStateChange(isOpen: boolean) {
    console.log('Sidebar state changed to:', isOpen); 
    this.isSidebarOpen = isOpen;
  }
}
