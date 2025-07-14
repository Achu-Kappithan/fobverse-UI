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

  @Input() isDarkMode: boolean = false
  @Output() darkModeToggled = new EventEmitter<boolean>();

  isProfileMenuOpen: boolean = false;
  private _router = inject(Router)

  constructor(
    private readonly _authService: UserRegisterService
  ){}

  ngOnInit(): void {
    this._authService.admin$.subscribe(val=>{
      console.log("current user in state",val)
    })
    const saveTheme = localStorage.getItem('theme')
    if(saveTheme == 'dark'){
      this.isDarkMode = true
      document.documentElement.classList.add('dark')
    }else{
      this.isDarkMode = false
      document.documentElement.classList.remove('dark')
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if(this.isDarkMode){
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme','dark')
    }else{
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme','light')
    }
    this.darkModeToggled.emit(this.isDarkMode)
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logoutUser(){
    this._authService.logoutUser()
  }
}
