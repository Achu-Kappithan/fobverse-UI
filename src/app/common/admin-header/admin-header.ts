import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  imports: [CommonModule],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css'
})
export class AdminHeader {
  @Input() isSidebarOpen: boolean = true;
  @Output() darkModeToggled = new EventEmitter<boolean>();

  isDarkMode: boolean = false;
  isProfileMenuOpen: boolean = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode); // Toggle a 'dark' class on the body
    this.darkModeToggled.emit(this.isDarkMode);
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }
}
