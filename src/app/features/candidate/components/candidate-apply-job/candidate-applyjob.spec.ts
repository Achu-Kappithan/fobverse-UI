
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateApplyjob } from './candidate-applyjob';

describe('CandidateApplyjob', () => {
  let component: CandidateApplyjob;
  let fixture: ComponentFixture<CandidateApplyjob>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      imports: [CandidateApplyjob]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateApplyjob);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
