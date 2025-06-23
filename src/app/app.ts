import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserRegisterService } from './features/auth/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App  implements OnInit {
  protected title = 'fobverse';
  constructor(private authservice: UserRegisterService){}

  ngOnInit(): void {
    this.authservice.getCurrentUserDetails().subscribe()
  }
}
