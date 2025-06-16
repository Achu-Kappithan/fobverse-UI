import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-candidate-home',
  imports: [],
  templateUrl: './candidate-home.html',
  styleUrl: './candidate-home.css'
})
export class CandidateHome {
  
  constructor(private _router:Router){}

  company(){
    this._router.navigate(['/candidate/company'])
  }
}
