import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { UserPartial } from '../../shared/interfaces/apiresponce.interface';
import { AuthService } from '../../features/auth/services/auth.service';
import { RouterModule } from '@angular/router';
import { ClickOutsideDirective } from '../../shared/directives/click-outside';
import { ThemeService } from '../../shared/services/theme/theme.service';
import { environment } from '../../../env/environment';

@Component({
  selector: 'app-candidate-header',
  imports: [CommonModule, RouterModule, ClickOutsideDirective],
  templateUrl: './candidate-header.html',
  styleUrl: './candidate-header.css',
})
export class CandidateHeader implements OnInit {

  baseUrl:string = environment.cloudinaryBaseUrl

  opendModal: string | null = null;

  isDarkMode: boolean = false;

  candidate: UserPartial | null = null;

  constructor(
    private readonly _authService: AuthService,
    private readonly _themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this._themeService.isDarkMode$.subscribe(val =>{
      this.isDarkMode = val
    })
    this._authService.candidate$.subscribe({
      next: (can) => {
        this.candidate = can;
      },
    });
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
    this._themeService.toggleDarkMode()
  }
}
