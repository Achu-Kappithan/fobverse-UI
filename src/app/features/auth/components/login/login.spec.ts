import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateLogin } from './login';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { of } from 'rxjs';

describe('CandidateLogin', () => {
  let component: CandidateLogin;
  let fixture: ComponentFixture<CandidateLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateLogin],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: SocialAuthService,
          useValue: {
            authState: of(null),
            initState: of(true),
            signIn: jasmine.createSpy('signIn'),
            signOut: jasmine.createSpy('signOut')
          }
        }
      ]
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
