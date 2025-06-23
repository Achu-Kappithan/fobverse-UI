import { Component, OnInit } from '@angular/core';
import { UserRegisterService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-candidate-home',
  imports: [],
  templateUrl: './candidate-home.html',
  styleUrl: './candidate-home.css'
})
export class CandidateHome implements OnInit {

  constructor(private userservise: UserRegisterService) {}
  ngOnInit(): void {
    this.userservise.user$.subscribe((user)=>{
      console.log(user)
    })
  }
}
