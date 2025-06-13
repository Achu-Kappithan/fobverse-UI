import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerificationSuccess } from './email-verification-success';

describe('EmailVerificationSuccess', () => {
  let component: EmailVerificationSuccess;
  let fixture: ComponentFixture<EmailVerificationSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailVerificationSuccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailVerificationSuccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
