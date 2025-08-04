import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-candidate-home',
  imports: [],
  templateUrl: './candidate-home.html',
  styleUrl: './candidate-home.css',
})
export class CandidateHome implements OnInit {
  private destroy$ = new Subject<void>();

  constructor(private userservise: AuthService) {}
  ngOnInit(): void {
    setTimeout(() => {
      if (!this.destroy$.isStopped) {
        this.userservise
          .getCurrentUserDetails()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (userDetails) => {
              console.log('User details fetched successfully:', userDetails);
            },
          });
      }
    }, 500);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
