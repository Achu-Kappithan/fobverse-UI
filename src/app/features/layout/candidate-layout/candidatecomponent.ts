import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CandidateHeaderComponent } from '../../../common/candidate-header/candidate-header';

@Component({
  selector: 'app-candidatecomponent',
  imports: [RouterOutlet,CandidateHeaderComponent],
  templateUrl: './candidatecomponent.html',
  styleUrl: './candidatecomponent.css'
})
export class CandidateLayoutComponent {
}
