import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminHeader } from '../../../common/admin-header/admin-header';
import { CompanyHeader } from '../../../common/company-header/company-header';
import { CompanySidebar } from '../../../common/company-sidebar/company-sidebar';

@Component({
  selector: 'app-company-component',
  imports: [CommonModule,RouterModule,CompanyHeader,CompanySidebar],
  templateUrl: './company-component.html',
  styleUrl: './company-component.css'
})
export class CompanyComponent implements OnInit {
  isSidebarOpen: boolean = true
  isDarkMode : boolean = false

  ngOnInit(): void {
    const saveTheme = localStorage.getItem('theme');

    if(saveTheme == 'dark'){
      this.isDarkMode = true
      document.documentElement.classList.add('dark')
    }else{
      this.isDarkMode = false
      document.documentElement.classList.remove('dark')
    }
  }

  onSidebarToggle(isOpen:boolean){
    this.isSidebarOpen = isOpen
  }

  onDarkModeToggle(isDark:boolean){
    this.isDarkMode = isDark
  }
}
