import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyApplication } from '../../../services/company-application';
import {
  ApplicationInterface,
  applicationWithProfile,
  ContactInfoItem,
} from '../../../interfaces/company.responce.interface';
import { CandidateInterface } from '../../../../candidate/interfaces/candidate.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../env/environment';
import { TextTransformPipe } from '../../../../../shared/pipes/text-transform-pipe';

@Component({
  selector: 'app-application-details',
  imports: [CommonModule, FormsModule,TextTransformPipe],
  templateUrl: './application-details.html',
  styleUrl: './application-details.css',
})
export class ApplicationDetails implements OnInit {
  applicationId: string | null = null;
  candidateId: string | null = null;
  applicationDetails: applicationWithProfile | null = null;
  profileData: CandidateInterface | null = null;
  addressValue: string | null = null;
  isLoading : boolean = false
  baseUrl:string = environment.cloudinaryBaseUrl;
  Math = Math

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _ApplicationService: CompanyApplication,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._route.paramMap.subscribe((parms) => {
      this.applicationId = parms.get('appId');
      this.candidateId = parms.get('canId');
    });

    console.log(
      'application id:',
      this.applicationId,
      ' candidateId :',
      this.candidateId
    );
    if (this.applicationId && this.candidateId) {
      this.fetchApplicationDetails();
    }
  }

  fetchApplicationDetails() {
    this.isLoading = true
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
            console.log(value)
            this.isLoading = false
            this._cdr.detectChanges()
        },
        error: (err) => {
          console.log(
            'error  regading  fetch applicationDetails with profile',
            err
          );
          this._cdr.detectChanges()
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
}
