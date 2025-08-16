import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { UserPartial } from '../../shared/interfaces/apiresponce.interface';

@Component({
  selector: 'app-admin-header',
  imports: [CommonModule,RouterModule],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css',
})
export class AdminHeader implements OnInit {
  
  activeAdmin:UserPartial | null  = null

  @Input() isSidebarOpen: boolean = true;
  @Input() isDarkMode: boolean = false;

  @Output() darkModeToggled = new EventEmitter<boolean>();

  isProfileMenuOpen: boolean = false;
  private _router = inject(Router);

  constructor(private readonly _authService: AuthService) {}

  ngOnInit(): void {
    this._authService.admin$.subscribe((val) => {
      this.activeAdmin = val
      console.log('current user in state', this.activeAdmin);
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

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logoutUser() {
    this._authService.logoutUser('admin');
  }
}
