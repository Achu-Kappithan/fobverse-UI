import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateApplyjob } from './candidate-applyjob';

describe('CandidateApplyjob', () => {
  let component: CandidateApplyjob;
  let fixture: ComponentFixture<CandidateApplyjob>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
