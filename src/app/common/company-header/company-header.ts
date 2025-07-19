import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { UserRegisterService } from '../../features/auth/services/auth.service';
import { CompanyService } from '../../features/company/services/company-service';
import { RouterModule } from '@angular/router';
import { UserPartial } from '../../shared/interfaces/apiresponce.interface';

@Component({
  selector: 'app-company-header',
  imports: [CommonModule,RouterModule],
  templateUrl: './company-header.html',
  styleUrl: './company-header.css'
})
export class CompanyHeader implements OnInit {

  @Input() isDarkMode: boolean = false
  @Output() darkModeToggled = new EventEmitter<boolean>();
  isProfileMenuOpen: boolean = false;
  userProfile:string = '/profileimages/defaultProfile.jpg'

  constructor(
    private readonly _authService : UserRegisterService,
    private readonly _CompanyService : CompanyService,
    private readonly cdr : ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this._authService.company$.subscribe({
      next:(comp)=>{
        console.log("active user",comp)
        this.userProfile = comp?.profileImg!
        this.cdr.detectChanges()
      }
    })
    this._CompanyService.companyProfile$.subscribe({
      next:(data =>{
        console.log("active company profile",data)
      })
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

  logOut(){
    this._authService.logoutUser()
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu-container') && this.isProfileMenuOpen) {
      this.isProfileMenuOpen = false;
    }
  }

  


}
