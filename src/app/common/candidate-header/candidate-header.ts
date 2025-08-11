import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserPartial } from '../../shared/interfaces/apiresponce.interface';
import { AuthService } from '../../features/auth/services/auth.service';
import { RouterModule } from '@angular/router';
import { ClickOutsideDirective } from '../../shared/directives/click-outside';

@Component({
  selector: 'app-candidate-header',
  imports: [CommonModule, RouterModule, ClickOutsideDirective],
  templateUrl: './candidate-header.html',
  styleUrl: './candidate-header.css',
})
export class CandidateHeader implements OnInit {
  opendModal: string | null = null;

  @Input() isDarkMode: boolean = false;
  @Output() darkModeToggled = new EventEmitter<boolean>();

  candidate: UserPartial | null = null;

  constructor(private readonly _authService: AuthService) {}

  ngOnInit(): void {
    this._authService.candidate$.subscribe({
      next: (can) => {
        this.candidate = can;
      },
    });

    const saveTheme = localStorage.getItem('theme');
    if (saveTheme == 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    } else {
      this.isDarkMode = false;
      document.documentElement.classList.remove('dark');
    }
  }

  logOut(user:string){
    this._authService.logoutUser(user)
  }

  toggleModal(id: string): void {
    this.opendModal = id;
  }

  isModalOpen(id: string): boolean {
    return this.opendModal === id;
  }

  closeModal(): void {
    this.opendModal = null;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    this.darkModeToggled.emit(this.isDarkMode);
  }
}
