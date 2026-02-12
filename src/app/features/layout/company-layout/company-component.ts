import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoggerService } from '../../../shared/services/logger/logger.service';
import { CompanyHeaderComponent } from '../../../common/company-header/company-header';
import { CompanySidebarComponent } from '../../../common/company-sidebar/company-sidebar';
import { AutoCollapseSidebarDirective } from '../../../shared/directives/auto-collapse-sidebar';

@Component({
  selector: 'app-company-component',
  imports: [CommonModule,RouterModule,CompanyHeaderComponent,CompanySidebarComponent,AutoCollapseSidebarDirective],
  templateUrl: './company-component.html',
  styleUrl: './company-component.css'
})
export class CompanyComponent {
  isSidebarOpen = false;
  isVideoCall = false;
  private readonly _logger = inject(LoggerService);

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
     this.checkIfVideoCall();
    });
  }

  checkIfVideoCall() {
     this.isVideoCall = this.router.url.includes('video-interview');
  }

  onSidebarToggle(isOpen:boolean){
    this.isSidebarOpen = isOpen
  }


  handleSidebarStateChange(isOpen: boolean) {
    this._logger.log('Sidebar state changed to:', isOpen); 
    this.isSidebarOpen = isOpen;
  }
}
