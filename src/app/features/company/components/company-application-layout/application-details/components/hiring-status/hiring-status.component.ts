import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hiring-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hiring-status.component.html',
  styleUrls: ['./hiring-status.component.css']
})
export class HiringStatusComponent {
  @Input() status: string | null = null;
}
