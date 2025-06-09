import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSignup } from './candidate-signup';

describe('CandidateSignup', () => {
  let component: CandidateSignup;
  let fixture: ComponentFixture<CandidateSignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateSignup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateSignup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
