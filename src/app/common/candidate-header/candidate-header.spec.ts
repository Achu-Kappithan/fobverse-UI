
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateHeader } from './candidate-header';

describe('CandidateHeader', () => {
  let component: CandidateHeader;
  let fixture: ComponentFixture<CandidateHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      imports: [CandidateHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
