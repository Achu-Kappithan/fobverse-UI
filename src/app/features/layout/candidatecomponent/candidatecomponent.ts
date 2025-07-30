import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CandidateHeader } from '../../../common/candidate-header/candidate-header';

@Component({
  selector: 'app-candidatecomponent',
  imports: [RouterOutlet,CandidateHeader],
  templateUrl: './candidatecomponent.html',
  styleUrl: './candidatecomponent.css'
})
export class Candidatecomponent {
  isDarkMode : boolean = false

  onDarkModeToggle(isDark:boolean){
    this.isDarkMode = isDark
  }

}
