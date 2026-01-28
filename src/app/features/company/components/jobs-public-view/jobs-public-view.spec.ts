
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsPublicView } from './jobs-public-view';

describe('JobsPublicView', () => {
  let component: JobsPublicView;
  let fixture: ComponentFixture<JobsPublicView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      imports: [JobsPublicView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsPublicView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
