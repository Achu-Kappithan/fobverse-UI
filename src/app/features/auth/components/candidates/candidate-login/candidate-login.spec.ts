import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateLogin } from './candidate-login';

describe('CandidateLogin', () => {
  let component: CandidateLogin;
  let fixture: ComponentFixture<CandidateLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
