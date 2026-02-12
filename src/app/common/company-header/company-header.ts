import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { CompanyService } from '../../features/company/services/company-service';
import { RouterModule } from '@angular/router';
import { environment } from '../../../env/environment';
import { UserPartial } from '../../shared/interfaces/api-response.interface';
import { ThemeService } from '../../shared/services/theme/theme.service';
import { ConfirmService } from '../../shared/services/confirm/confirm.service';
import { LoggerService } from '../../shared/services/logger/logger.service';

@Component({
  selector: 'app-company-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './company-header.html',
  styleUrl: './company-header.css',
})
export class CompanyHeaderComponent implements OnInit {
  isDarkMode = false;
  isProfileMenuOpen = false;
  cloudinaryBaseUrl = environment.cloudinaryBaseUrl
  userPorfile: string | null = null
  activeUser:UserPartial | null = null
  private readonly _logger = inject(LoggerService);

  constructor(
    private readonly _authService: AuthService,
    private readonly _CompanyService: CompanyService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _themeService: ThemeService,
    private readonly _confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this._themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    this._authService.company$.subscribe({
      next: (comp) => {
        this._logger.log('active company user in header', comp);
        this.activeUser = comp
        this.userPorfile = comp?.profileImg ? this.cloudinaryBaseUrl + comp.profileImg : null;
        this._logger.log("userprofile image path",this.userPorfile)
        this._cdr.detectChanges();
      },
    });
    this._CompanyService.companyProfile$.subscribe({
      next: (data) => {
        this._logger.log('active company profile data in header', data);
      },
    });
  }

  toggleDarkMode() {
    this._themeService.toggleDarkMode()
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  async logOut(): Promise<void> {
    const isConfirmed = await this._confirmService.confirm({
      title: 'Logout Confirmation',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      type: 'warning'
    });

    if (isConfirmed) {
      this._authService.logoutUser('company');
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu-container') && this.isProfileMenuOpen) {
      this.isProfileMenuOpen = false;
    }
  }
}
