
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetNewPassword } from './set-new-password';

describe('SetNewPassword', () => {
  let component: SetNewPassword;
  let fixture: ComponentFixture<SetNewPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      imports: [SetNewPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetNewPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
