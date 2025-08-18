import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateJoblist } from './candidate-joblist';

describe('CandidateJoblist', () => {
  let component: CandidateJoblist;
  let fixture: ComponentFixture<CandidateJoblist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateJoblist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateJoblist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
