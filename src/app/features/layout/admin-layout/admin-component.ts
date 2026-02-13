import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from '../../../common/admin-header/admin-header';
import { AdminSidebarComponent } from '../../../common/admin-sidebar/admin-sidebar';
import { CommonModule } from '@angular/common';
import { AutoCollapseSidebarDirective } from '../../../shared/directives/auto-collapse-sidebar';

@Component({
  selector: 'app-admin-component',
  imports: [RouterOutlet, AdminHeaderComponent, AdminSidebarComponent, CommonModule, AutoCollapseSidebarDirective],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css',
})
export class AdminComponent {

  isSidebarOpen = false;

  onSidebarToggle(isOpen: boolean) {
    this.isSidebarOpen = isOpen;
  }

  handleSidebarStateChange(isOpen: boolean) {
    this.isSidebarOpen = isOpen;
  }

}
