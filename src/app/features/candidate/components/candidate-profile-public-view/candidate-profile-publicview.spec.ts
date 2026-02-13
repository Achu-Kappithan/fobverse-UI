
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateProfilePublicview } from './candidate-profile-publicview';

describe('CandidateProfilePublicview', () => {
  let component: CandidateProfilePublicview;
  let fixture: ComponentFixture<CandidateProfilePublicview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
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
