import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-candidate-joblist',
  imports: [CommonModule],
  templateUrl: './candidate-joblist.html',
  styleUrl: './candidate-joblist.css'
})
export class CandidateJoblist {
  listView:boolean = false

  toggleView(){
    this.listView = !this.listView
  }

}
