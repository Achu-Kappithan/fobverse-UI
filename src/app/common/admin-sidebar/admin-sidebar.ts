import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css'
})
export class AdminSidebar {
@Input() isOpen = true; // Allow the parent to set the initial state
  @Output() sidebarToggled = new EventEmitter<boolean>(); // Emit the new state
  selectedItem = 'Dashboard'; // Track the selected item

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.sidebarToggled.emit(this.isOpen); // Emit the updated state
  }

  setSelectedItem(item: string) {
    this.selectedItem = item; // Update the selected item
  }
}
