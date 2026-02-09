
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateJoblist } from './candidate-joblist';

describe('CandidateJoblist', () => {
  let component: CandidateJoblist;
  let fixture: ComponentFixture<CandidateJoblist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      imports: [CandidateJoblist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateJoblist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
