import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CompanyService } from '../../services/company-service';
import { InternalUserInterface } from '../../interfaces/company.responce.interface';

@Component({
  selector: 'app-internal-user.component',
  imports: [RouterOutlet],
  templateUrl: './internal-user.component.html',
  styleUrl: './internal-user.component.css'
})
export class InternalUserComponent {

}
