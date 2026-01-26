import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyApplication } from '../../../services/company-application';
import {
  applicationWithProfile,
} from '../../../interfaces/company.responce.interface';
import { CandidateInterface } from '../../../../candidate/interfaces/candidate.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../env/environment';
import { TextTransformPipe } from '../../../../../shared/pipes/text-transform-pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Stages } from '../../../../../shared/enums/Interview-stages.enum';
import { SweetAlert } from '../../../../../shared/services/sweet-alert';
import { animate, style, transition, trigger } from '@angular/animations';
import { QualifiedStageComponent } from './components/qualified-stage/qualified-stage.component';
import { TelephonicStageComponent } from './components/telephonic-stage/telephonic-stage.component';
import { TechnicalStageComponent } from './components/technical-stage/technical-stage.component';
import { HiringStatusComponent } from './components/hiring-status/hiring-status.component';

@Component({
  selector: 'app-application-details',
  imports: [
    CommonModule, 
    FormsModule, 
    TextTransformPipe, 
    QualifiedStageComponent,
    TelephonicStageComponent,
    TechnicalStageComponent,
    HiringStatusComponent
  ],
  templateUrl: './application-details.html',
  styleUrl: './application-details.css',
  animations: [
    trigger('slideFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' })),
      ]),
    ]),
  ],
})
export class ApplicationDetails implements OnInit {
  contentId: string = 'Profile';
  pdfSrc: SafeResourceUrl | null = null;
  applicationId: string | null = null;
  candidateId: string | null = null;
  applicationDetails: applicationWithProfile | null = null;
  profileData: CandidateInterface | null = null;
  addressValue: string | null = null;
  isLoading: boolean = false;
  isLoadingStage: boolean = false;
  baseUrl: string = environment.cloudinaryBaseUrl;
  readonly cloudinaryBaseUrl = environment.cloudinaryUrl;
  resumePdfUrl: string | null = null;
  Math = Math;
  currentStageIndex: number = -1;

  currentStageId: string = 'shortlisted';
  interviewScheduled: boolean = true;
  
  hiringStages = ['Qualified', 'Telephonic', 'Technical', 'Hired'];

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _ApplicationService: CompanyApplication,
    private readonly _sanitizer: DomSanitizer,
    private readonly _swal: SweetAlert,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._route.paramMap.subscribe((parms) => {
      this.applicationId = parms.get('appId');
      this.candidateId = parms.get('canId');
    });

    if (this.applicationId && this.candidateId) {
      this.fetchApplicationDetails();
    }
  }

  fetchApplicationDetails() {
    this.isLoading = true;
    this._ApplicationService
      .getApplicationDetails(this.applicationId!, this.candidateId!)
      .subscribe({
        next: (value) => {
          this.applicationDetails = value.data;
          this.profileData = value.data.profile;
          const addressObj = this.profileData?.contactInfo?.find(
            (item) => item.type === 'address'
          );
          this.addressValue = addressObj
            ? addressObj.value
            : 'No address available';
          console.log(value);
          this.setResumeUrl();
          this.getStages(value.data.Stages);
          this.isLoading = false;
          this._cdr.detectChanges();
        },
        error: (err) => {
          console.log(
            'error  regading  fetch applicationDetails with profile',
            err
          );
          this._cdr.detectChanges();
        },
      });
  }


  getStarRating(percentage: number | null | undefined): number {
    if (percentage === null || percentage === undefined) {
      return 0;
    }
    const fivePointScore = percentage / 20;
    return Math.round(fivePointScore * 2) / 2;
  }

  setResumeUrl() {
    const baseUrl = `${this.cloudinaryBaseUrl}/image/upload${this.applicationDetails?.resumeUrl}`;
    this.resumePdfUrl = `${baseUrl}#toolbar=0&navpanes=0&scrollbar=0`;
    this.pdfSrc = this._sanitizer.bypassSecurityTrustResourceUrl(
      this.resumePdfUrl
    );
  }

  switchContent(id: string) {
    this.contentId = id;
  }

  activeContent(id: string): boolean {
    return this.contentId == id;
  }

  switchStages(id: string): void {
    this.currentStageId = id;
  }

  activeStage(id: string): boolean {
    return this.currentStageId == id;
  }


  getStages(stage: string ): void {
    switch (stage) {
      case Stages.Default:
        this.currentStageIndex = 0;
        break;

      case Stages.Shortlisted:
      case Stages.Telephone:
        this.currentStageIndex = 1;
        break;

      case Stages.Technical:
        this.currentStageIndex = 2;
        break;

      case Stages.Hired:
        this.currentStageIndex = 3;
        break;

      default: 
        this.currentStageIndex = -1;
    }
  }

  getStageStatus(index: number): 'completed' | 'current' | 'pending' {
    if (this.currentStageIndex === -1) return 'pending';

    if (index < this.currentStageIndex) return 'completed';
    if (index === this.currentStageIndex) {
      if (index === 3 && (this.applicationDetails?.Stages as any) === Stages.Hired) {
        return 'completed';
      }
      return 'current';
    }
    return 'pending';
  }

  isStageEnabled(stageId: string): boolean {
    switch (stageId) {
      case 'shortlisted':
        return true; 
      case 'telephone':
        return this.currentStageIndex >= 1;
      case 'technical_analysis':
        return this.currentStageIndex >= 2;
      case 'hired_declined':
        return this.currentStageIndex >= 3;
      default:
        return false;
    }
  }
}
