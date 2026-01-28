
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPublicProfile } from './company-public-profile';

describe('CompanyPublicProfile', () => {
  let component: CompanyPublicProfile;
  let fixture: ComponentFixture<CompanyPublicProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      imports: [CompanyPublicProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyPublicProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
