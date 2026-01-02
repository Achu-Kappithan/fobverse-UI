import { Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/services/theme/theme.service';
import { SocketService } from './shared/services/socket/socket.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  constructor(
    private _themeService:ThemeService,
    private _socketService: SocketService
  ) {}

  ngOnInit(): void {
    this._socketService.connect()
  }
}
