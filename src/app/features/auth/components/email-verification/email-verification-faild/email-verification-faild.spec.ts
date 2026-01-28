
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerificationFaild } from './email-verification-faild';

describe('EmailVerificationFaild', () => {
  let component: EmailVerificationFaild;
  let fixture: ComponentFixture<EmailVerificationFaild>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
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
