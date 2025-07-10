import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-company-sidebar',
  imports: [CommonModule,RouterModule],
  templateUrl: './company-sidebar.html',
  styleUrl: './company-sidebar.css'
})
export class CompanySidebar {
  @Input() isOpen = true; 
  @Output() sidebarToggled = new EventEmitter<boolean>(); 

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.sidebarToggled.emit(this.isOpen); 
  }

  
}
