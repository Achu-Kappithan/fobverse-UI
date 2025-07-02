import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminHeader } from '../../../common/admin-header/admin-header';
import { AdminSidebar } from '../../../common/admin-sidebar/admin-sidebar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-component',
  imports: [RouterOutlet, AdminHeader, AdminSidebar, CommonModule],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css',
})
export class AdminComponent {
isSidebarOpen = true;
  isDarkMode = false;

  onSidebarToggle(isOpen: boolean) {
    this.isSidebarOpen = isOpen;
  }

  onDarkModeToggle(isDark: boolean) {
    this.isDarkMode = isDark;
    // You can apply a global class to the body or root element here
    // For example, if you want to control the entire app's dark mode from here
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
