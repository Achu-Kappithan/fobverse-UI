import { Component } from '@angular/core';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside';

@Component({
  selector: 'app-admin-candidates-list',
  imports: [ClickOutsideDirective],
  templateUrl: './admin-candidates-list.html',
  styleUrl: './admin-candidates-list.css'
})
export class AdminCandidatesList {

  isdorpDownOpen : boolean = false;

  toggleDropdown(){
    this.isdorpDownOpen = !this.isdorpDownOpen
  }

  closeDropdown(){
    this.isdorpDownOpen = false
  }

}
