import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyApplication } from '../../../services/company-application';
import {
  applicationWithProfile,
  InternalUserInterface,
} from '../../../interfaces/company.responce.interface';
import { CandidateInterface } from '../../../../candidate/interfaces/candidate.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../env/environment';
import { TextTransformPipe } from '../../../../../shared/pipes/text-transform-pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { interviewStages } from '../../../../../shared/enums/Interview-stages.enum';

@Component({
  selector: 'app-application-details',
  imports: [CommonModule, FormsModule, TextTransformPipe],
  templateUrl: './application-details.html',
  styleUrl: './application-details.css',
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
  baseUrl: string = environment.cloudinaryBaseUrl;
  readonly cloudinaryBaseUrl = environment.cloudinaryUrl;
  resumePdfUrl: string | null = null;
  Math = Math;
  currentStageIndex: number = 2;

  currentStageId: string = 'stage-shortlisted';
  interviewScheduled: boolean = false;
  sheduleModal: boolean = false;
  hrList: InternalUserInterface[] | null = null;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _ApplicationService: CompanyApplication,
    private readonly _sanitizer: DomSanitizer,
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

  sheduleModalOpen() {
    if (!this.hrList) {
      this._ApplicationService.getHrlist().subscribe({
        next: (res) => {
          console.log(res.data)
          this.hrList = res.data
          this._cdr.detectChanges()
        },
        error: (err) => {
          console.log('error regading  fetch  hr list ', err);
        },
      });
    }
    this.sheduleModal = true;
  }

  sheduleModalclose() {
    this.sheduleModal = false;
  }

  get atsPassed(): boolean {
    return (
      (this.applicationDetails?.atsScore ?? 0) >=
      (this.applicationDetails?.atsCriteria ?? 0)
    );
  }

  hiringStages = ['Shortlisted', 'Telephoneic', 'Technicals', 'Hired/Reject'];

  getStages(stage: string): void {
    if (stage === interviewStages.Shortlisted) {
      this.currentStageIndex = 1;
    } else if (stage === interviewStages.Telephone) {
      this.currentStageIndex = 2;
    } else if (stage === interviewStages.Technical) {
      this.currentStageIndex = 3;
    } else if (stage === interviewStages.Hired) {
      this.currentStageIndex = 4;
    } else {
      this.currentStageIndex = 0;
    }
  }

  getStageStatus(index: number): 'completed' | 'current' | 'pending' {
    if (index < this.currentStageIndex) {
      return 'completed';
    } else if (index === this.currentStageIndex) {
      return 'current';
    } else {
      return 'pending';
    }
  }
}
