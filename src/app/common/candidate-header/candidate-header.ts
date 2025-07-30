import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserPartial } from '../../shared/interfaces/apiresponce.interface';
import { UserRegisterService } from '../../features/auth/services/auth.service';
import { RouterModule } from '@angular/router';
import { ClickOutsideDirective } from '../../shared/directives/click-outside';

@Component({
  selector: 'app-candidate-header',
  imports: [CommonModule,RouterModule,ClickOutsideDirective],
  templateUrl: './candidate-header.html',
  styleUrl: './candidate-header.css'
})
export class CandidateHeader implements OnInit {

  isModalOpen:boolean = false

  @Input() isDarkMode:boolean = false
  @Output() darkModeToggled = new EventEmitter<boolean>()

  candidate:UserPartial | null = null

  constructor(private readonly _authService: UserRegisterService) {}

  ngOnInit(): void {
    this._authService.candidate$.subscribe({
      next:(can =>{
        this.candidate = can
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

  toggleModal(){
    this.isModalOpen = !this.isModalOpen
  }

  toggleDarkMode(){
    this.isDarkMode = !this.isDarkMode
    if(this.isDarkMode){
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme','dark')
    }else{
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme','light')
    }
    this.darkModeToggled.emit(this.isDarkMode)
  }
}
