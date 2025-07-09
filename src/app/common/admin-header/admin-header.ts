import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserRegisterService } from '../../features/auth/services/auth.service';

@Component({
  selector: 'app-admin-header',
  imports: [CommonModule],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css'
})
export class AdminHeader implements OnInit {
  @Input() isSidebarOpen: boolean = true;
  @Output() darkModeToggled = new EventEmitter<boolean>();

  isDarkMode: boolean = false;
  isProfileMenuOpen: boolean = false;

  constructor(
    private readonly _authService: UserRegisterService
  ){}

  ngOnInit(): void {
    this._authService.user$.subscribe(val=>{
      console.log("current user in state",val)
    })
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode); 
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }
}
