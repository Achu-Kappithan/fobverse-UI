import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { applicationWithProfile } from '../../../../../interfaces/company.response.interface';

@Component({
  selector: 'app-qualified-stage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qualified-stage.component.html',
  styleUrls: ['./qualified-stage.component.css']
})
export class QualifiedStageComponent {
  @Input() data: applicationWithProfile | null = null;
  Math = Math;

  get atsPassed(): boolean {
    return (
      (this.data?.atsScore ?? 0) >=
      (this.data?.atsCriteria ?? 0)
    );
  }
}
