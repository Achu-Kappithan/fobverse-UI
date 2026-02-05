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
import { UserPartial } from '../../shared/interfaces/api-response.interface';
import { environment } from '../../../env/environment';
import { ThemeService } from '../../shared/services/theme/theme.service';
import { ClickOutsideDirective } from '../../shared/directives/click-outside';
import { ConfirmService } from '../../shared/services/confirm/confirm.service';

@Component({
  selector: 'app-admin-header',
  imports: [CommonModule, RouterModule, ClickOutsideDirective],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css',
})
export class AdminHeader implements OnInit {
  
  activeAdmin:UserPartial | null  = null
  cludBaseUrl:string = environment.cloudinaryBaseUrl

  @Input() isSidebarOpen: boolean = true;
  isDarkMode: boolean = false

  @Output() darkModeToggled = new EventEmitter<boolean>();

  isProfileMenuOpen: boolean = false;
  private _router = inject(Router);

  constructor(
    private readonly _authService: AuthService,
    private readonly _themeService: ThemeService,
    private readonly _confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this._themeService.isDarkMode$.subscribe(val=>{
      this.isDarkMode = val
    })
    this._authService.admin$.subscribe((val) => {
      this.activeAdmin = val
      console.log('current user in state', this.activeAdmin);
    });
  }

  toggleDarkMode() {
    this._themeService.toggleDarkMode()
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  async logoutUser(): Promise<void> {
    const isConfirmed = await this._confirmService.confirm({
      title: 'Logout Confirmation',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      type: 'warning'
    });

    if (isConfirmed) {
      this._authService.logoutUser('admin');
    }
  }
}
