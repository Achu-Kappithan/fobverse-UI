import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminHeader } from '../../../common/admin-header/admin-header';
import { AdminSidebar } from '../../../common/admin-sidebar/admin-sidebar';
import { CommonModule } from '@angular/common';
import { AutoCollapseSidebar } from '../../../shared/directives/auto-collapse-sidebar';

@Component({
  selector: 'app-admin-component',
  imports: [RouterOutlet, AdminHeader, AdminSidebar, CommonModule, AutoCollapseSidebar],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css',
})
export class AdminComponent {

  isSidebarOpen = true;
  isDarkMode = false;

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedMode = localStorage.getItem('theme');
      this.isDarkMode = (savedMode === 'dark');
      this.applyDarkModeClass(); 
    }
  }

  onDarkModeToggle(isDark: boolean): void {
    this.isDarkMode = isDark;
    this.applyDarkModeClass(); 
    
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
  }

  private applyDarkModeClass(): void {
    if (typeof document !== 'undefined') {
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  onSidebarToggle(isOpen: boolean) {
    this.isSidebarOpen = isOpen;
  }

  handleSidebarStateChange(isOpen: boolean) {
    console.log('Sidebar state changed to:', isOpen); // For debugging
    this.isSidebarOpen = isOpen;
  }


}
