import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { UserRegisterService } from '../../features/auth/services/auth.service';
import { Router } from '@angular/router';

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
  private _router = inject(Router)

  constructor(
    private readonly _authService: UserRegisterService
  ){}

  ngOnInit(): void {
    this._authService.admin$.subscribe(val=>{
      console.log("current user in state",val)
    })
  }

  toggleDarkMode() {
    console.log('darkmode')
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode); 
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logoutUser(){
    this._authService.logoutUser()
  }
}
