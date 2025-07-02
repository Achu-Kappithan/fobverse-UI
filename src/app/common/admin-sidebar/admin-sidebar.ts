import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css'
})
export class AdminSidebar {
  @Input() isOpen = true; 
  @Output() sidebarToggled = new EventEmitter<boolean>(); 
  selectedItem = 'Dashboard'; 

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.sidebarToggled.emit(this.isOpen); 
  }

  setSelectedItem(item: string) {
    this.selectedItem = item; 
  }
}
