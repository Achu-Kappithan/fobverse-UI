import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerificationFaild } from './email-verification-faild';

describe('EmailVerificationFaild', () => {
  let component: EmailVerificationFaild;
  let fixture: ComponentFixture<EmailVerificationFaild>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailVerificationFaild]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailVerificationFaild);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
