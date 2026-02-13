
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateApplyJobComponent } from './candidate-applyjob';

describe('CandidateApplyjob', () => {
  let component: CandidateApplyJobComponent;
  let fixture: ComponentFixture<CandidateApplyJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      imports: [CandidateApplyJobComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateApplyJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
