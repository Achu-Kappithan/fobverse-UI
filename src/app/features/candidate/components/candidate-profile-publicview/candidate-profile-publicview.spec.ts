import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateProfilePublicview } from './candidate-profile-publicview';

describe('CandidateProfilePublicview', () => {
  let component: CandidateProfilePublicview;
  let fixture: ComponentFixture<CandidateProfilePublicview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateProfilePublicview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateProfilePublicview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
