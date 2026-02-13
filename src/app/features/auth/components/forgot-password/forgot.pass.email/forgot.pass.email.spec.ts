
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPassEmail } from './forgot.pass.email';

describe('ForgotPassEmail', () => {
  let component: ForgotPassEmail;
  let fixture: ComponentFixture<ForgotPassEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      imports: [ForgotPassEmail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPassEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
